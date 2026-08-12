import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { ArrowRightIcon } from './ui/Icons';

/** Category tile used on the home page and the categories page. */
export default function CategoryCard({ category, priority = false, size = 'md' }) {
  const href = category.href || `/products?category=${category.slug}`;
  const tall = size === 'lg';

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-graphite transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_30px_60px_-34px_rgba(201,162,39,0.6)]"
    >
      <div className={`relative overflow-hidden bg-obsidian ${tall ? 'aspect-4/5' : 'aspect-square'}`}>
        <Image
          src={category.image}
          alt={`${category.name} — Core Byte Media LLC`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent"
        />
        {category.isCustom && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Your design
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg text-cream transition-colors group-hover:text-gold">
          {category.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{category.short}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs text-faint">
            {category.isCustom ? 'Start designing' : `From ${formatPrice(category.from)}`}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.16em] text-gold">
            {category.isCustom ? 'Customize' : 'View Products'}
            <ArrowRightIcon
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
