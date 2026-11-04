'use client';

import Image from 'next/image';
import { CONTACT, SHIPPING, TAX } from '@/data/site';
import { formatPrice } from '@/lib/utils';
import Button from './ui/Button';
import Logo from './Logo';
import { CashIcon, CheckCircleIcon, CreditCardIcon, MailIcon, TruckIcon } from './ui/Icons';

/**
 * Post-order screen.
 *
 * The order number is generated client-side for this demo storefront — a real
 * deployment would render the identifier returned by the order system.
 */
export default function OrderConfirmation({ order }) {
  const paidByCard = order.paymentMethod === 'card';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 text-gold">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold/50" aria-hidden="true" />
          <CheckCircleIcon size={38} />
        </span>

        <div className="space-y-3">
          <h1 className="text-3xl text-cream sm:text-4xl">Order Placed Successfully!</h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted">
            Thank you, {order.customer.fullName.split(' ')[0]}. We have your order and will start
            preparing it right away. Keep your order number for reference.
          </p>
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold/[0.06] px-8 py-5">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">Order Number</p>
          <p className="mt-1.5 font-mono text-xl font-semibold text-gold sm:text-2xl">
            {order.orderNumber}
          </p>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-line bg-graphite">
        <span className="rule-gold block" aria-hidden="true" />

        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <Logo height={76} href={null} />
          <div className="text-right">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-faint">Order date</p>
            <p className="text-sm text-cream">{order.placedAt}</p>
          </div>
        </div>

        <div className="grid gap-8 border-b border-line px-6 py-6 sm:grid-cols-2">
          <section>
            <h2 className="eyebrow mb-3">Delivering to</h2>
            <address className="space-y-1 text-sm not-italic leading-relaxed text-muted">
              <p className="text-cream">{order.customer.fullName}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.email}</p>
              <p className="pt-2">{order.customer.addressLine1}</p>
              {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}
              <p>
                {[
                  order.customer.city,
                  [order.customer.state, order.customer.zipCode].filter(Boolean).join(' '),
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>{order.customer.country}</p>
            </address>
            {order.customer.notes && (
              <p className="mt-3 rounded-lg border border-line bg-charcoal/50 p-3 text-xs leading-relaxed text-muted">
                <span className="text-cream">Note: </span>
                {order.customer.notes}
              </p>
            )}
          </section>

          <section>
            <h2 className="eyebrow mb-3">Payment & delivery</h2>
            <ul className="space-y-3 text-sm">
              {paidByCard ? (
                <li className="flex items-start gap-2.5">
                  <CreditCardIcon size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span className="text-muted">
                    <span className="block text-cream">Paid by card</span>
                    {order.authorizationOnly
                      ? `${formatPrice(order.totals.total)} authorised on your card.`
                      : `${formatPrice(order.totals.total)} charged to your card.`}
                    {order.transactionId && (
                      <span className="block text-xs text-faint">
                        Transaction ID: <span className="font-mono">{order.transactionId}</span>
                      </span>
                    )}
                  </span>
                </li>
              ) : (
                <li className="flex items-start gap-2.5">
                  <CashIcon size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span className="text-muted">
                    <span className="block text-cream">Cash on Delivery</span>
                    Pay {formatPrice(order.totals.total)} to the carrier when your order arrives.
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <TruckIcon size={16} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-muted">
                  <span className="block text-cream">Estimated delivery</span>
                  {SHIPPING.estimate.processingDays} to prepare, then{' '}
                  {SHIPPING.estimate.standard} in transit.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MailIcon size={16} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-muted">
                  <span className="block text-cream">Questions?</span>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
                    {CONTACT.email}
                  </a>
                </span>
              </li>
            </ul>
          </section>
        </div>

        <section className="px-6 py-6">
          <h2 className="eyebrow mb-4">Items ordered</h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.key} className="flex items-center gap-4 py-3.5">
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

          <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-cream tabular-nums">{formatPrice(order.totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Standard shipping</dt>
              <dd className="text-cream tabular-nums">
                {order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{TAX.label}</dt>
              <dd className="tabular-nums">
                {order.totals.taxEnabled ? (
                  <span className="text-cream">{formatPrice(order.totals.tax)}</span>
                ) : (
                  <span className="text-faint">Calculated at fulfilment</span>
                )}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="text-base text-cream">
                {paidByCard ? 'Total paid' : 'Total payable on delivery'}
              </dt>
              <dd className="text-2xl font-semibold text-gold tabular-nums">
                {formatPrice(order.totals.total)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {order.hasCustomItems && (
        <p className="mt-6 rounded-xl border border-gold/25 bg-gold/[0.05] p-5 text-sm leading-relaxed text-champagne">
          <span className="font-medium">One more step for your custom item.</span> The design preview
          runs entirely in your browser, so your artwork file was never uploaded. We will email you at{' '}
          {order.customer.email} to collect the original file before printing.
        </p>
      )}

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/products" size="lg">
          Continue Shopping
        </Button>
        <Button href="/" variant="outline" size="lg">
          Back to Home
        </Button>
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-faint">
        This storefront stores orders in your browser for the current session only. Connecting an
        order management system is the intended next step — see the notes in{' '}
        <span className="font-mono">lib/cart.js</span>.
      </p>
    </div>
  );
}
