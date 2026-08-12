import { PAYMENT, SHIPPING, TAX } from '@/data/site';
import { formatPrice } from '@/lib/utils';
import Button from './ui/Button';
import { ShieldIcon, TruckIcon } from './ui/Icons';

/**
 * Order totals panel, shared by the cart page and checkout.
 * When `children` is supplied it replaces the default checkout button.
 */
export default function CartSummary({
  totals,
  title = 'Order Summary',
  showCheckoutButton = true,
  children = null,
}) {
  return (
    <div className="surface-card sticky top-28 overflow-hidden">
      <span className="rule-gold block" aria-hidden="true" />

      <div className="space-y-5 p-6">
        <h2 className="text-lg text-cream">{title}</h2>

        {totals.freeShippingRemaining > 0 && (
          <div className="rounded-lg border border-gold/25 bg-gold/[0.06] p-3.5">
            <p className="text-xs leading-relaxed text-champagne">
              You are {formatPrice(totals.freeShippingRemaining)} away from free shipping.
            </p>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-slate">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-500"
                style={{
                  width: `${Math.min(100, (totals.subtotal / SHIPPING.freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">
              Subtotal <span className="text-faint">({totals.count} items)</span>
            </dt>
            <dd className="text-cream tabular-nums">{formatPrice(totals.subtotal)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="tabular-nums">
              {totals.shipping === 0 ? (
                <span className="text-emerald-400">Free</span>
              ) : (
                <span className="text-cream">{formatPrice(totals.shipping)}</span>
              )}
            </dd>
          </div>

          {/* Tax only appears when a real rate is configured — see STORE_CONFIG.tax. */}
          <div className="flex items-center justify-between">
            <dt className="text-muted">{TAX.label}</dt>
            <dd className="tabular-nums">
              {totals.taxEnabled ? (
                <span className="text-cream">{formatPrice(totals.tax)}</span>
              ) : (
                <span className="text-faint">Calculated at fulfilment</span>
              )}
            </dd>
          </div>

          {totals.codFee > 0 && (
            <div className="flex items-center justify-between">
              <dt className="text-muted">Cash on Delivery fee</dt>
              <dd className="text-cream tabular-nums">{formatPrice(totals.codFee)}</dd>
            </div>
          )}

          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <dt className="text-base text-cream">Total</dt>
            <dd className="text-2xl font-semibold text-gold tabular-nums">
              {formatPrice(totals.total)}
            </dd>
          </div>
        </dl>

        {children ??
          (showCheckoutButton && (
            <Button href="/checkout" fullWidth size="lg">
              Proceed to Checkout
            </Button>
          ))}

        <ul className="space-y-2.5 border-t border-line pt-5 text-xs text-muted">
          <li className="flex items-start gap-2.5">
            <TruckIcon size={15} className="mt-px shrink-0 text-gold/70" />
            <span>
              Made to order in {SHIPPING.estimate.processingDays}, then{' '}
              {SHIPPING.estimate.standard} in transit. Free standard shipping on orders over{' '}
              {formatPrice(SHIPPING.freeShippingThreshold)}.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldIcon size={15} className="mt-px shrink-0 text-gold/70" />
            <span>
              {PAYMENT.cardEnabled
                ? 'Secure checkout.'
                : 'No card details are collected anywhere on this site.'}
            </span>
          </li>
        </ul>

        {SHIPPING.isDemoPricing && (
          <p className="text-[0.65rem] leading-relaxed text-faint">
            Shipping rates are example values held in a single configuration file and can be changed
            without touching the storefront.
          </p>
        )}
      </div>
    </div>
  );
}
