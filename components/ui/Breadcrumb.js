import Link from 'next/link';
import { ChevronRightIcon } from './Icons';
import { cn } from '@/lib/utils';

/**
 * Breadcrumb trail. Pass items as `[{ label, href }]`; the final item is
 * rendered as the current page and is not a link.
 */
export default function Breadcrumb({ items = [], className = '' }) {
  const trail = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-faint">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span className="text-muted" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-gold focus-visible:text-gold"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRightIcon size={12} className="text-line" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
