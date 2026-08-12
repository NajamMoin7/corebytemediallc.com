'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { cartTotals, saveOrder } from '@/lib/cart';
import {
  formatDate,
  formatPhone,
  formatPrice,
  generateOrderNumber,
  isValidEmail,
  isValidPhone,
  isValidZipCode,
} from '@/lib/utils';
import { PAYMENT, TAX } from '@/data/site';
import { US_STATES } from '@/data/us-states';
import CheckoutForm from './CheckoutForm';
import PaymentMethod from './PaymentMethod';
import OrderConfirmation from './OrderConfirmation';
import CartSummary from './CartSummary';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { Skeleton, Spinner } from './ui/LoadingSpinner';
import { AlertIcon, CartIcon, CreditCardIcon } from './ui/Icons';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  notes: '',
};

/** The method a shopper lands on: card when it is live, otherwise COD. */
const DEFAULT_PAYMENT_METHOD = PAYMENT.cardEnabled ? 'card' : PAYMENT.codEnabled ? 'cod' : null;

/**
 * Checkout flow: validate → choose payment → place order → confirmation.
 *
 * Only a payment method that is enabled in STORE_CONFIG can place an order.
 * Card is blocked before any submission happens while `cardEnabled` is false.
 */
export default function CheckoutView() {
  const { items, totals, hydrated, clearCart } = useCart();
  const { toast } = useToast();

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState(DEFAULT_PAYMENT_METHOD);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  /** Closing the card notice falls back to a method that can actually complete. */
  function dismissCardNotice() {
    setCardModalOpen(false);
    if (PAYMENT.codEnabled) setPayment('cod');
  }

  function handleChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const next = {};

    if (!values.fullName.trim()) next.fullName = 'Please enter your full name.';
    else if (values.fullName.trim().length < 3) next.fullName = 'Please enter your full name.';

    if (!values.email.trim()) next.email = 'Please enter your email address.';
    else if (!isValidEmail(values.email)) next.email = 'That email address does not look right.';

    if (!values.phone.trim()) next.phone = 'Please enter a phone number.';
    else if (!isValidPhone(values.phone))
      next.phone = 'Enter a 10-digit US phone number, e.g. (512) 555-0123.';

    if (!values.addressLine1.trim()) next.addressLine1 = 'Please enter your street address.';
    else if (values.addressLine1.trim().length < 5)
      next.addressLine1 = 'Please enter a complete street address.';

    if (!values.city.trim()) next.city = 'Please enter your city.';

    if (!values.state) next.state = 'Please select a state.';

    if (!values.zipCode.trim()) next.zipCode = 'Please enter your ZIP code.';
    else if (!isValidZipCode(values.zipCode))
      next.zipCode = 'Enter a valid ZIP code, e.g. 78758 or 78758-1234.';

    if (!values.country) next.country = 'Please select a country.';

    setErrors(next);
    return next;
  }

  function handlePlaceOrder(event) {
    event.preventDefault();

    // Never let a disabled method reach order placement.
    if (payment === 'card' && !PAYMENT.cardEnabled) {
      setCardModalOpen(true);
      return;
    }
    if (payment !== 'cod' || !PAYMENT.codEnabled) {
      setCardModalOpen(true);
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: 'Please check the highlighted fields',
        description: 'A few details are missing or incomplete.',
        variant: 'error',
      });

      const firstField = Object.keys(validationErrors)[0];
      document.getElementById(firstField)?.focus();
      document.getElementById(firstField)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setPlacing(true);

    // Brief pause so the button state is perceptible; a real deployment awaits
    // the order API here instead.
    window.setTimeout(() => {
      const stateName =
        US_STATES.find((state) => state.code === values.state)?.name ?? values.state;

      const placed = {
        orderNumber: generateOrderNumber(),
        placedAt: formatDate(new Date()),
        customer: {
          ...values,
          phone: formatPhone(values.phone),
          stateName,
        },
        items,
        totals: cartTotals(items, { paymentMethod: 'cod' }),
        paymentMethod: 'Cash on Delivery',
        hasCustomItems: items.some((item) => Boolean(item.custom)),
      };

      saveOrder(placed);
      setOrder(placed);
      clearCart();
      setPlacing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      toast({
        title: 'Order placed successfully.',
        description: `Order ${placed.orderNumber} — pay ${formatPrice(placed.totals.total)} on delivery.`,
        variant: 'success',
        duration: 7000,
      });
    }, 700);
  }

  if (order) {
    return <OrderConfirmation order={order} />;
  }

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
        <div className="space-y-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-line py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line text-line">
          <CartIcon size={34} />
        </span>
        <div className="space-y-2">
          <h2 className="text-2xl text-cream">There is nothing to check out</h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
            Add something to your cart first — then come back here to complete the order.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/products">Shop Products</Button>
          <Button href="/customize" variant="outline">
            Customize a Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handlePlaceOrder} noValidate>
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="min-w-0 space-y-10">
            <CheckoutForm values={values} errors={errors} onChange={handleChange} />

            <fieldset className="space-y-5">
              <legend className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/35 text-xs font-semibold text-gold">
                  03
                </span>
                <span className="text-lg text-cream">Payment Method</span>
              </legend>

              <PaymentMethod
                value={payment}
                onChange={setPayment}
                onCardAttempt={() => setCardModalOpen(true)}
              />

              {!PAYMENT.cardEnabled && (
                <p className="flex items-start gap-2.5 rounded-lg border border-line bg-charcoal/40 p-4 text-xs leading-relaxed text-muted">
                  <AlertIcon size={15} className="mt-0.5 shrink-0 text-gold/70" />
                  This site does not collect, transmit or store card details anywhere. When a payment
                  provider is connected, card data will be handled by that provider rather than by
                  this storefront.
                </p>
              )}

              {!TAX.enabled && (
                <p className="text-xs leading-relaxed text-faint">{TAX.note}</p>
              )}
            </fieldset>

            {/* Order review */}
            <section aria-labelledby="review-heading">
              <h2 id="review-heading" className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/35 text-xs font-semibold text-gold">
                  04
                </span>
                <span className="text-lg text-cream">Review Your Order</span>
              </h2>

              <ul className="divide-y divide-line rounded-xl border border-line bg-graphite px-5">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center gap-4 py-4">
                    <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-obsidian">
                      {item.image && (
                        <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-cream">{item.name}</span>
                      <span className="block text-xs text-faint">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                        {item.custom && ' · Custom design'}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">× {item.quantity}</span>
                    <span className="w-24 shrink-0 text-right text-sm text-cream tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div>
            <CartSummary totals={totals} title="Order Total">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={placing}
                  className="flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-champagne via-gold to-gold-dark text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:h-14"
                >
                  {placing ? (
                    <>
                      <Spinner size={16} className="text-ink" />
                      Placing order…
                    </>
                  ) : payment === 'cod' ? (
                    'Place Order — Cash on Delivery'
                  ) : (
                    'Place Order'
                  )}
                </button>
                <p className="text-center text-[0.65rem] leading-relaxed text-faint">
                  By placing this order you agree to our{' '}
                  <a href="/terms-and-conditions" className="text-muted underline underline-offset-2 hover:text-gold">
                    Terms &amp; Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/returns" className="text-muted underline underline-offset-2 hover:text-gold">
                    Return Policy
                  </a>
                  .
                </p>
              </div>
            </CartSummary>
          </div>
        </div>
      </form>

      {/* Card payment not yet connected */}
      <Modal
        open={cardModalOpen}
        onClose={dismissCardNotice}
        size="sm"
        title="Online Card Payment Coming Soon"
        footer={
          <Button fullWidth onClick={dismissCardNotice}>
            {PAYMENT.codEnabled ? 'Continue with Cash on Delivery' : 'Back to checkout'}
          </Button>
        }
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
            <CreditCardIcon size={28} />
          </span>
          <p className="text-sm leading-relaxed text-muted">
            Card payments are currently being prepared.{' '}
            {PAYMENT.codEnabled
              ? 'In the meantime you can complete this order with Cash on Delivery and pay the carrier when it arrives.'
              : 'Please check back soon, or contact us for available ordering options.'}
          </p>
          <p className="text-xs leading-relaxed text-faint">
            No payment was attempted, and no card number, expiry date or security code was requested
            or stored.
          </p>
        </div>
      </Modal>
    </>
  );
}
