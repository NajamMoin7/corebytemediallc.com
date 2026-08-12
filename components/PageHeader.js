import { cn } from '@/lib/utils';

/** Standard page title block used across the interior pages. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
  children,
}) {
  const centered = align === 'center';

  return (
    <header
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="text-balance text-3xl leading-tight text-cream sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            'text-pretty text-sm leading-relaxed text-muted sm:text-base',
            centered ? 'max-w-2xl' : 'max-w-2xl',
          )}
        >
          {description}
        </p>
      )}
      {children}
      <span className="mt-2 h-px w-16 bg-gradient-to-r from-gold to-transparent" aria-hidden="true" />
    </header>
  );
}
