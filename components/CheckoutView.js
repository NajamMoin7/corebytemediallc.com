'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { cartTotals, saveOrder } from '@/lib/cart';
import {
  formatDate,
  formatPrice,
  generateOrderNumber,
  isValidEmail,
  isValidPhone,
} from '@/lib/utils';
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
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Pakistan',
  notes: '',
};

/**
 * Checkout flow: validate → choose payment → place order → confirmation.
 *
 * Cash on Delivery is the only path that can place an order. Card payment is
 * intentionally blocked before any submission happens.
 */
export default function CheckoutView() {
  const { items, totals, hydrated, clearCart } = useCart();
  const { toast } = useToast();

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState('cod');
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

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
      next.phone = 'Enter a valid phone number the courier can reach.';

    if (!values.address.trim()) next.address = 'Please enter your delivery address.';
    else if (values.address.trim().length < 10)
      next.address = 'Please give a full address including the street and area.';

    if (!values.city.trim()) next.city = 'Please enter your city.';

    if (values.country === 'Pakistan' && !values.province) {
      next.province = 'Please select a province.';
    }

    if (!values.country) next.country = 'Please select a country.';

    setErrors(next);
    return next;
  }

  function handlePlaceOrder(event) {
    event.preventDefault();

    // Card is unavailable — never let a card selection reach order placement.
    if (payment !== 'cod') {
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
      const placed = {
        orderNumber: generateOrderNumber(),
        placedAt: formatDate(new Date()),
        customer: { ...values },
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

              <p className="flex items-start gap-2.5 rounded-lg border border-line bg-charcoal/40 p-4 text-xs leading-relaxed text-muted">
                <AlertIcon size={15} className="mt-0.5 shrink-0 text-gold/70" />
                This site does not collect, transmit or store card details anywhere. When a payment
                gateway is connected, card data will be handled by the provider rather than by this
                storefront.
              </p>
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
                  ) : (
                    'Place Order — Cash on Delivery'
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

      {/* Card payment unavailable */}
      <Modal
        open={cardModalOpen}
        onClose={() => {
          setCardModalOpen(false);
          setPayment('cod');
        }}
        size="sm"
        title="Card Payment is Currently Unavailable"
        footer={
          <Button
            fullWidth
            onClick={() => {
              setCardModalOpen(false);
              setPayment('cod');
            }}
          >
            Use Cash on Delivery
          </Button>
        }
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-red-500/35 bg-red-500/10 text-red-400">
            <CreditCardIcon size={28} />
          </span>
          <p className="text-sm leading-relaxed text-muted">
            Online card payment is currently unavailable. Please select Cash on Delivery to complete
            your order.
          </p>
          <p className="text-xs leading-relaxed text-faint">
            No payment was attempted and no card details were requested or stored. We will announce
            card payment here once a gateway is live.
          </p>
        </div>
      </Modal>
    </>
  );
}
