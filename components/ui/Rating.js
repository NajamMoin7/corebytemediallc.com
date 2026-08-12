import { StarIcon } from './Icons';
import { cn } from '@/lib/utils';

/**
 * Star rating. The numeric value is exposed to screen readers; the stars
 * themselves are decorative.
 */
export default function Rating({ value = 0, count = null, size = 14, className = '', showValue = true }) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="flex items-center gap-0.5 text-gold" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((position) => (
          <StarIcon
            key={position}
            size={size}
            filled={rounded >= position}
            half={rounded === position - 0.5}
            className={rounded >= position - 0.5 ? 'text-gold' : 'text-slate'}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs text-muted tabular-nums">
          {value.toFixed(1)}
          {count != null && <span className="text-faint"> ({count})</span>}
        </span>
      )}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count != null ? ` from ${count} reviews` : ''}
      </span>
    </div>
  );
}
