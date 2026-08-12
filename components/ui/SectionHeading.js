import { cn } from '@/lib/utils';
import Reveal from './Reveal';

/**
 * Shared section header: small gold eyebrow, serif title, supporting copy.
 * `as` lets callers keep the document heading order correct.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  as: Tag = 'h2',
  className = '',
  children,
}) {
  const centered = align === 'center';

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <span className="eyebrow flex items-center gap-3">
          <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <Tag className="text-balance text-3xl leading-tight text-cream sm:text-4xl lg:text-[2.75rem]">
        {title}
      </Tag>
      {description && (
        <p className={cn('text-pretty text-sm leading-relaxed text-muted sm:text-base', centered && 'max-w-2xl')}>
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
}
