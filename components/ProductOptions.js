'use client';

import { cn } from '@/lib/utils';
import { MinusIcon, PlusIcon } from './ui/Icons';

/** Size selector — a radio group rendered as pills. */
export function SizeSelector({ sizes, value, onChange, error = false, idPrefix = 'size' }) {
  return (
    <div role="radiogroup" aria-label="Select a size" className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const selected = value === size;
        return (
          <button
            key={size}
            id={`${idPrefix}-${size}`}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(size)}
            className={cn(
              'min-w-[3.25rem] rounded-lg border px-3.5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] transition-all duration-200',
              selected
                ? 'border-gold bg-gold/12 text-gold'
                : 'border-line bg-charcoal/60 text-muted hover:border-gold/40 hover:text-cream',
              error && !value && 'border-red-500/50',
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

/** Colour swatches. The swatch itself is decorative; the name is the label. */
export function ColorSelector({ colors, value, onChange, error = false }) {
  return (
    <div role="radiogroup" aria-label="Select a colour" className="flex flex-wrap gap-2.5">
      {colors.map((color) => {
        const selected = value === color.name;
        return (
          <button
            key={color.key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(color.name)}
            title={color.name}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-all duration-200',
              selected
                ? 'border-gold bg-gold/12 text-gold'
                : 'border-line bg-charcoal/60 text-muted hover:border-gold/40 hover:text-cream',
              error && !value && 'border-red-500/50',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'h-4 w-4 rounded-full border',
                selected ? 'border-gold' : 'border-white/25',
              )}
              style={{ backgroundColor: color.hex }}
            />
            {color.name}
          </button>
        );
      })}
    </div>
  );
}

/** Quantity stepper with a typed input for larger numbers. */
export function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const compact = size === 'sm';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-line bg-charcoal/60',
        compact ? 'h-9' : 'h-11',
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          'flex h-full items-center justify-center text-muted transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-muted',
          compact ? 'w-8' : 'w-11',
        )}
      >
        <MinusIcon size={compact ? 13 : 15} />
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label="Quantity"
        onChange={(event) => {
          const next = parseInt(event.target.value, 10);
          onChange(Number.isNaN(next) ? min : Math.min(Math.max(next, min), max));
        }}
        className={cn(
          'h-full border-x border-line bg-transparent text-center text-sm font-medium tabular-nums text-cream outline-none',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          compact ? 'w-10' : 'w-14',
        )}
      />

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          'flex h-full items-center justify-center text-muted transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-muted',
          compact ? 'w-8' : 'w-11',
        )}
      >
        <PlusIcon size={compact ? 13 : 15} />
      </button>
    </div>
  );
}
