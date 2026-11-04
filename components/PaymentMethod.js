'use client';

import { PAYMENT } from '@/data/site';
import { cn, formatPrice } from '@/lib/utils';
import { CashIcon, CheckIcon, CreditCardIcon } from './ui/Icons';

/**
 * Payment method selection, driven by PAYMENT in STORE_CONFIG.
 *
 * Card is listed first because that is what a US shopper expects to see. Card
 * payments go through NMI: the card fields (CardFields) are NMI-hosted iframes,
 * so card data never touches this site. With `PAYMENT.cardEnabled` off, card
 * opens the "coming soon" notice instead and can never place an order.
 */
export default function PaymentMethod({ value, onChange, onCardAttempt }) {
  return (
    <div className="space-y-4" role="radiogroup" aria-label="Payment method">
      <Option
        selected={PAYMENT.cardEnabled && value === 'card'}
        disabled={!PAYMENT.cardEnabled}
        onSelect={PAYMENT.cardEnabled ? () => onChange('card') : onCardAttempt}
        Icon={CreditCardIcon}
        title="Credit or Debit Card"
        badge={PAYMENT.cardEnabled ? 'Available' : 'Coming soon'}
        badgeTone={PAYMENT.cardEnabled ? 'available' : 'pending'}
        description={
          PAYMENT.cardEnabled
            ? 'Pay securely by card. Your card details are handled by our payment provider and never stored on this site.'
            : 'Online card payment is being prepared and is not connected yet. No card details are requested or stored anywhere on this website.'
        }
      />

      {PAYMENT.codEnabled && (
        <Option
          selected={value === 'cod'}
          onSelect={() => onChange('cod')}
          Icon={CashIcon}
          title="Cash on Delivery"
          badge="Available"
          badgeTone="available"
          description={`Pay the carrier when your order arrives — nothing is charged before delivery. Available on orders up to ${formatPrice(
            PAYMENT.codOrderLimit,
          )}, subject to carrier support at your address.`}
        />
      )}
    </div>
  );
}

function Option({
  selected,
  disabled = false,
  onSelect,
  Icon,
  title,
  description,
  badge,
  badgeTone,
}) {
  const tones = {
    available: 'bg-emerald-500/15 text-emerald-400',
    pending: 'bg-gold/15 text-gold',
    unavailable: 'bg-red-500/15 text-red-400',
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex w-full gap-4 rounded-xl border p-5 text-left transition-all duration-300',
        selected
          ? 'border-gold bg-gold/[0.07]'
          : disabled
            ? 'border-line bg-charcoal/30 opacity-70 hover:border-gold/30'
            : 'border-line bg-charcoal/50 hover:border-gold/40',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors',
          selected ? 'border-gold/50 bg-gold/10 text-gold' : 'border-line text-muted',
        )}
      >
        <Icon size={20} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2.5">
          <span className={cn('text-base', selected ? 'text-gold' : 'text-cream')}>{title}</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em]',
              tones[badgeTone] || tones.unavailable,
            )}
          >
            {badge}
          </span>
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-muted">{description}</span>
      </span>

      <span
        className={cn(
          'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-gold bg-gold text-ink' : 'border-line',
        )}
        aria-hidden="true"
      >
        {selected && <CheckIcon size={11} />}
      </span>
    </button>
  );
}
