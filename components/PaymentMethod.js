'use client';

import { cn } from '@/lib/utils';
import { CashIcon, CheckIcon, CreditCardIcon } from './ui/Icons';

/**
 * Payment method selection.
 *
 * Cash on Delivery is the only working method. The card option is present so the
 * checkout is ready for a future gateway, but it is disabled: selecting it opens
 * the unavailable notice and never places an order. No card fields exist
 * anywhere in this codebase — nothing is collected or stored.
 */
export default function PaymentMethod({ value, onChange, onCardAttempt }) {
  return (
    <div className="space-y-4" role="radiogroup" aria-label="Payment method">
      <Option
        selected={value === 'cod'}
        onSelect={() => onChange('cod')}
        Icon={CashIcon}
        title="Cash on Delivery"
        badge="Available"
        badgeTone="available"
        description="Pay the courier in cash when your parcel is handed to you. Nothing is charged before delivery, and no payment details are collected on this site."
      />

      <Option
        selected={false}
        disabled
        onSelect={onCardAttempt}
        Icon={CreditCardIcon}
        title="Card Payment"
        badge="Unavailable"
        badgeTone="unavailable"
        description="Debit and credit card payment is not enabled yet. We are preparing for it, but no gateway is connected — please use Cash on Delivery to complete your order."
      />
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
            ? 'border-line bg-charcoal/30 opacity-70 hover:border-red-500/35'
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
              badgeTone === 'available'
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-red-500/15 text-red-400',
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
