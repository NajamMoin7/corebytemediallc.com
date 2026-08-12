'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getCategoryName } from '@/lib/products';
import { cn, discountPercent, formatPrice } from '@/lib/utils';
import Badge from './ui/Badge';
import Rating from './ui/Rating';
import QuickViewModal from './QuickViewModal';
import { CartIcon, EyeIcon } from './ui/Icons';

/**
 * Product tile used on the home page, listing pages and related-product rails.
 *
 * `priority` should only be set for the handful of cards above the fold, so the
 * rest stay lazily loaded.
 */
export default function ProductCard({ product, priority = false, className = '' }) {
  const { addItem } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const discount = discountPercent(product);
  const price = product.salePrice ?? product.price;
  const soldOut = !product.inStock;

  function handleQuickAdd() {
    // Straight from a card we take the default size/colour; the product page and
    // quick view are where a customer chooses explicitly.
    addItem({
      product,
      size: product.sizes[0],
      color: product.colors[0]?.name ?? null,
      quantity: 1,
      image: product.colors[0]?.image ?? product.images[0]?.src,
    });
  }

  return (
    <>
      <article
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-xl border border-line bg-graphite transition-all duration-500',
          'hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_28px_50px_-30px_rgba(201,162,39,0.55)]',
          className,
        )}
      >
        <div className="relative aspect-4/5 overflow-hidden bg-obsidian">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={cn(
              'object-cover transition-transform duration-700 ease-out will-change-transform',
              'group-hover:scale-[1.06]',
              soldOut && 'opacity-45 saturate-0',
            )}
          />

          {/* Badges */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {discount && <Badge tone="sale">-{discount}%</Badge>}
            {product.isNew && <Badge tone="outline">New</Badge>}
            {product.featured && !discount && !product.isNew && <Badge tone="gold">Featured</Badge>}
          </div>

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/55">
              <span className="rounded-full border border-line bg-ink/90 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted">
                Out of stock
              </span>
            </div>
          )}

          {/* Hover actions — always reachable by keyboard via the buttons below. */}
          {!soldOut && (
            <div
              className={cn(
                'absolute inset-x-3 bottom-3 z-20 flex gap-2 transition-all duration-400',
                'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
                'focus-within:translate-y-0 focus-within:opacity-100',
                'max-md:translate-y-0 max-md:opacity-100',
              )}
            >
              <button
                type="button"
                onClick={() => setQuickViewOpen(true)}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-ink/90 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-cream backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold"
              >
                <EyeIcon size={14} />
                <span className="hidden sm:inline">Quick View</span>
                <span className="sm:hidden">View</span>
              </button>
              <button
                type="button"
                onClick={handleQuickAdd}
                aria-label={`Add ${product.name} to cart`}
                className="flex h-10 w-11 items-center justify-center rounded-full bg-gradient-to-br from-champagne via-gold to-gold-dark text-ink transition-transform hover:scale-105 active:scale-95"
              >
                <CartIcon size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-faint">
            {getCategoryName(product.category)}
          </span>

          <h3 className="text-base leading-snug text-cream transition-colors group-hover:text-gold">
            <Link href={`/products/${product.slug}`} className="before:absolute before:inset-0 before:content-['']">
              {product.name}
            </Link>
          </h3>

          <Rating value={product.rating} count={product.reviews} />

          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <span className="text-lg font-semibold text-gold">{formatPrice(price)}</span>
            {product.salePrice && (
              <span className="text-sm text-faint line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </article>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
