import 'server-only';
import { PRODUCTS } from '@/data/products';
import { CUSTOM_PRODUCTS } from '@/data/customize';
import { CURRENCY, PAYMENT } from '@/data/site';
import { US_STATES } from '@/data/us-states';
import { cartTotals, clampQuantity } from './cart';
import { effectivePrice, isValidEmail, isValidPhone, isValidZipCode } from './utils';

/**
 * Server-side payment helpers for the NMI gateway.
 *
 * Only imported by `app/api/checkout/route.js` — this module reads the NMI
 * security key, which must never reach the browser. Card data never touches
 * this server: the browser exchanges it for a single-use `payment_token` via
 * Collect.js, and only that token is sent here.
 */

const MAX_LINES = 50;

/** Collect.js tokens are short strings of letters, digits and dashes. */
const TOKEN_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

export function isValidToken(token) {
  return typeof token === 'string' && TOKEN_PATTERN.test(token);
}

/** Upper bounds on free-text fields, so nothing oversized reaches the gateway. */
const FIELD_LIMITS = {
  fullName: 100,
  email: 254,
  phone: 25,
  addressLine1: 120,
  addressLine2: 120,
  city: 60,
  state: 2,
  zipCode: 10,
  notes: 1000,
};

/**
 * Rebuilds the cart from the catalogue so the charged amount never depends on
 * prices sent by the browser. Throws a CheckoutError for anything unknown.
 */
export function priceOrderItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutError('Your cart is empty.');
  }
  if (rawItems.length > MAX_LINES) {
    throw new CheckoutError('Too many items in one order. Please contact us for bulk orders.');
  }

  return rawItems.map((raw) => {
    const quantity = clampQuantity(raw?.quantity);
    const size = typeof raw?.size === 'string' ? raw.size : null;
    const color = typeof raw?.color === 'string' ? raw.color : null;

    if (raw?.custom) {
      const base = CUSTOM_PRODUCTS.find((product) => product.key === raw.custom.baseKey);
      if (!base) throw new CheckoutError('A custom item in your cart is no longer available.');
      return {
        key: String(raw.key ?? ''),
        name: base.name,
        size,
        color,
        quantity,
        unitPrice: base.basePrice,
        custom: { baseKey: base.key, designId: String(raw.custom.designId ?? '') },
      };
    }

    const product = PRODUCTS.find((item) => item.id === raw?.productId);
    if (!product) throw new CheckoutError('An item in your cart is no longer available.');
    if (product.inStock === false) {
      throw new CheckoutError(`${product.name} is currently out of stock.`);
    }
    return {
      key: String(raw.key ?? ''),
      name: product.name,
      sku: product.sku,
      size,
      color,
      quantity,
      unitPrice: effectivePrice(product),
      custom: null,
    };
  });
}

/** Mirrors the client-side checkout validation; returns field → message. */
export function validateCustomer(customer) {
  const c = customer ?? {};
  const text = (value) => (typeof value === 'string' ? value.trim() : '');
  const errors = {};

  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    if (c[field] != null && typeof c[field] !== 'string') errors[field] = 'Invalid value.';
    else if (text(c[field]).length > max) errors[field] = `Please keep this under ${max} characters.`;
  }
  if (Object.keys(errors).length > 0) return errors;

  if (text(c.fullName).length < 3) errors.fullName = 'Please enter your full name.';
  if (!isValidEmail(text(c.email))) errors.email = 'Please enter a valid email address.';
  if (!isValidPhone(text(c.phone))) errors.phone = 'Please enter a valid US phone number.';
  if (text(c.addressLine1).length < 5) errors.addressLine1 = 'Please enter your street address.';
  if (!text(c.city)) errors.city = 'Please enter your city.';
  if (!US_STATES.some((state) => state.code === c.state)) errors.state = 'Please select a state.';
  if (!isValidZipCode(text(c.zipCode))) errors.zipCode = 'Please enter a valid ZIP code.';

  return errors;
}

export function orderTotals(items) {
  const totals = cartTotals(items, { paymentMethod: 'card' });
  if (PAYMENT.cardOrderLimit && totals.total > PAYMENT.cardOrderLimit) {
    throw new CheckoutError(
      'This order is above our online card limit. Please contact us to complete a larger order.',
    );
  }
  return totals;
}

/**
 * Voids an approved transaction — used when the gateway approves a card whose
 * security code did not match, which is a common sign of a stolen card.
 */
export async function voidTransaction(transactionId, reason = 'fraud') {
  const body = new URLSearchParams({
    security_key: process.env.NMI_SECURITY_KEY,
    type: 'void',
    transactionid: transactionId,
    void_reason: reason,
  });

  const response = await fetch(gatewayUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
  });
  const result = new URLSearchParams(await response.text());
  return result.get('response') === '1';
}

/**
 * Charges a Collect.js payment token through the NMI Payment API.
 *
 * Resolves with the parsed gateway response; never throws for a decline.
 * See https://secure.nmi.com/merchants/resources/integration/integration_portal.php
 */
export async function chargeToken({ token, amount, orderNumber, customer, items, ipAddress }) {
  const securityKey = process.env.NMI_SECURITY_KEY;
  if (!securityKey) throw new Error('NMI_SECURITY_KEY is not configured.');

  const type = process.env.NMI_TRANSACTION_TYPE === 'auth' ? 'auth' : 'sale';
  const [firstName, ...rest] = customer.fullName.trim().split(/\s+/);
  const lastName = rest.join(' ');

  const address = {
    first_name: firstName,
    last_name: lastName,
    address1: customer.addressLine1.trim(),
    address2: (customer.addressLine2 || '').trim(),
    city: customer.city.trim(),
    state: customer.state,
    zip: customer.zipCode.trim(),
    country: 'US',
  };

  const body = new URLSearchParams({
    security_key: securityKey,
    type,
    payment_token: token,
    amount: amount.toFixed(CURRENCY.decimals),
    currency: CURRENCY.code,
    orderid: orderNumber,
    order_description: items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(', ')
      .slice(0, 255),
    ...address,
    phone: customer.phone.replace(/\D/g, ''),
    email: customer.email.trim(),
    // Shipping matches billing — checkout collects a single US address.
    shipping_firstname: address.first_name,
    shipping_lastname: address.last_name,
    shipping_address1: address.address1,
    shipping_address2: address.address2,
    shipping_city: address.city,
    shipping_state: address.state,
    shipping_zip: address.zip,
    shipping_country: address.country,
    shipping_email: customer.email.trim(),
    customer_receipt: process.env.NMI_CUSTOMER_RECEIPT === 'true' ? 'true' : 'false',
  });
  if (ipAddress) body.set('ipaddress', ipAddress);

  const response = await fetch(gatewayUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`NMI gateway returned HTTP ${response.status}.`);
  }

  const result = new URLSearchParams(await response.text());
  return {
    // 1 = approved, 2 = declined, 3 = error
    status: result.get('response'),
    message: result.get('responsetext') || '',
    transactionId: result.get('transactionid') || '',
    authCode: result.get('authcode') || '',
    avsResponse: result.get('avsresponse') || '',
    cvvResponse: result.get('cvvresponse') || '',
    responseCode: result.get('response_code') || '',
    type,
  };
}

/** Only HTTPS NMI endpoints are accepted, so a bad env value cannot leak the key. */
function gatewayUrl() {
  const url = process.env.NMI_API_URL || 'https://secure.nmi.com/api/transact.php';
  if (!/^https:\/\/[a-z0-9.-]+\.nmi\.com\//i.test(url)) {
    throw new Error('NMI_API_URL must be an https://*.nmi.com URL.');
  }
  return url;
}

/** An error whose message is safe to show the shopper. */
export class CheckoutError extends Error {
  constructor(message, { status = 400, fields = null } = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}
