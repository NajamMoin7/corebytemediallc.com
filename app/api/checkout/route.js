import {
  CheckoutError,
  chargeToken,
  isValidToken,
  orderTotals,
  priceOrderItems,
  validateCustomer,
  voidTransaction,
} from '@/lib/payment';
import { isLimited, rateLimit } from '@/lib/rate-limit';
import { formatDate, formatPhone, generateOrderNumber } from '@/lib/utils';
import { US_STATES } from '@/data/us-states';

/** Largest request body accepted; a full 50-line cart is well under this. */
const MAX_BODY_BYTES = 32 * 1024;

/** Payment attempts per IP — blunts card-testing bots. */
const ATTEMPT_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };
/** Declines per IP before card checkout is locked for that IP. */
const DECLINE_LIMIT = { limit: 4, windowMs: 60 * 60 * 1000 };

const NO_STORE = { 'Cache-Control': 'no-store' };

function reply(body, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

/** Rejects cross-site posts — the checkout page is the only legitimate caller. */
function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Card checkout: re-prices the cart from the catalogue, then charges the
 * Collect.js payment token through NMI. Returns the placed order on approval.
 *
 * Request body: { token, customer, items }
 */
export async function POST(request) {
  if (!isSameOrigin(request)) {
    return reply({ error: 'Forbidden.' }, 403);
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return reply({ error: 'Unsupported request.' }, 415);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  if (isLimited(`decline:${ip}`, DECLINE_LIMIT)) {
    return reply(
      { error: 'Card payment is temporarily unavailable. Please contact us to complete your order.' },
      429,
    );
  }
  const attempt = rateLimit(`attempt:${ip}`, ATTEMPT_LIMIT);
  if (!attempt.allowed) {
    return reply(
      { error: 'Too many payment attempts. Please wait a few minutes and try again.' },
      429,
      { 'Retry-After': String(attempt.retryAfter) },
    );
  }

  let payload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return reply({ error: 'Request too large.' }, 413);
    payload = JSON.parse(raw);
  } catch {
    return reply({ error: 'Invalid request.' }, 400);
  }

  const { token, customer, items } = payload ?? {};

  try {
    if (!isValidToken(token)) {
      throw new CheckoutError('Card details are missing. Please re-enter your card.');
    }

    const fieldErrors = validateCustomer(customer);
    if (Object.keys(fieldErrors).length > 0) {
      throw new CheckoutError('Please check the highlighted fields.', { fields: fieldErrors });
    }

    const pricedItems = priceOrderItems(items);
    const totals = orderTotals(pricedItems);
    if (totals.total <= 0) throw new CheckoutError('Your cart is empty.');

    const orderNumber = generateOrderNumber();

    const result = await chargeToken({
      token,
      amount: totals.total,
      orderNumber,
      customer,
      items: pricedItems,
      ipAddress: ip === 'unknown' ? '' : ip,
    });

    if (result.status === '2') {
      rateLimit(`decline:${ip}`, DECLINE_LIMIT);
      throw new CheckoutError(
        'Your card was declined. Please check the details or try a different card.',
        { status: 402 },
      );
    }
    if (result.status !== '1') {
      console.error('[checkout] NMI error', {
        orderNumber,
        code: result.responseCode,
        message: result.message,
      });
      throw new CheckoutError(
        'We could not process your card right now. You have not been charged — please try again.',
        { status: 502 },
      );
    }

    // Approved, but the security code did not match: reverse it rather than ship.
    if (result.cvvResponse === 'N') {
      const voided = await voidTransaction(result.transactionId).catch(() => false);
      rateLimit(`decline:${ip}`, DECLINE_LIMIT);
      if (!voided) {
        console.error('[checkout] CVV mismatch and void failed — review manually', {
          orderNumber,
          transactionId: result.transactionId,
        });
      }
      throw new CheckoutError(
        'The security code did not match your card. Please check it and try again.',
        { status: 402 },
      );
    }

    const stateName = US_STATES.find((state) => state.code === customer.state)?.name ?? customer.state;

    return reply({
      order: {
        orderNumber,
        placedAt: formatDate(new Date()),
        totals,
        paymentMethod: 'card',
        transactionId: result.transactionId,
        authorizationOnly: result.type === 'auth',
        customer: {
          fullName: customer.fullName.trim(),
          email: customer.email.trim(),
          phone: formatPhone(customer.phone),
          addressLine1: customer.addressLine1.trim(),
          addressLine2: (customer.addressLine2 || '').trim(),
          city: customer.city.trim(),
          state: customer.state,
          stateName,
          zipCode: customer.zipCode.trim(),
          country: 'United States',
          notes: typeof customer.notes === 'string' ? customer.notes.trim() : '',
        },
      },
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return reply({ error: error.message, fields: error.fields }, error.status);
    }
    console.error('[checkout] Unexpected error', error?.message);
    return reply(
      {
        // The gateway may have approved before the failure, so do not invite a blind retry.
        error:
          'We could not confirm your payment. Please contact us before trying again so you are not charged twice.',
      },
      500,
    );
  }
}
