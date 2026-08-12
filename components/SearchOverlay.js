'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { searchProducts, getCategoryName, CATEGORIES } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { CloseIcon, SearchIcon } from './ui/Icons';

const SUGGESTIONS = ['Hoodie', 'Oversized tee', 'Mug', 'Cap', 'Tote bag', 'Gold'];
const MAX_RESULTS = 6;

/**
 * Full-screen search. Filters the local catalogue as you type and links through
 * to the full results page for anything beyond the first few matches.
 */
export default function SearchOverlay({ open, onClose }) {
  // Mounting the panel only while open means the query starts empty each time
  // without an effect resetting it.
  if (!open) return null;
  return <SearchPanel onClose={onClose} />;
}

function SearchPanel({ onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const results = useMemo(() => (query.trim() ? searchProducts(query) : []), [query]);
  const trimmed = query.trim();

  function submit(event) {
    event.preventDefault();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[125] flex flex-col" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="absolute inset-0 animate-fade-in bg-ink/92 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div className="relative flex h-full flex-col overflow-y-auto">
        <div className="container-page flex items-center justify-between gap-4 py-5">
          <span className="eyebrow">Search</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full border border-line p-2.5 text-muted transition-colors hover:border-gold/50 hover:text-gold"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="container-page flex-1 pb-16">
          <form onSubmit={submit} className="animate-slide-down">
            <div className="flex items-center gap-4 border-b border-line pb-5 focus-within:border-gold/50">
              <SearchIcon size={24} className="shrink-0 text-gold" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for hoodies, mugs, caps…"
                aria-label="Search products"
                className="w-full bg-transparent text-xl text-cream outline-none placeholder:text-faint sm:text-3xl"
              />
            </div>
          </form>

          {!trimmed && (
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="eyebrow mb-4">Popular searches</h2>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-gold/45 hover:text-gold"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="eyebrow mb-4">Browse categories</h2>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  {CATEGORIES.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={category.href || `/products?category=${category.slug}`}
                        onClick={onClose}
                        className="text-muted transition-colors hover:text-gold"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {trimmed && results.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <SearchIcon size={40} className="text-line" />
              <p className="text-lg text-cream">No products match “{trimmed}”.</p>
              <p className="max-w-md text-sm text-muted">
                Try a broader term such as a category name — hoodie, tee, mug — or browse the full
                catalogue.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-2 rounded-full border border-gold/45 px-6 py-2.5 text-xs uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/10"
              >
                View all products
              </Link>
            </div>
          )}

          {trimmed && results.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 text-xs uppercase tracking-[0.16em] text-faint">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <ul className="divide-y divide-line border-y border-line">
                {results.slice(0, MAX_RESULTS).map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-3.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-obsidian">
                        <Image
                          src={product.images[0].src}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-cream transition-colors group-hover:text-gold">
                          {product.name}
                        </span>
                        <span className="block text-xs text-faint">
                          {getCategoryName(product.category)}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-medium text-gold">
                        {formatPrice(product.salePrice ?? product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {results.length > MAX_RESULTS && (
                <Link
                  href={`/search?q=${encodeURIComponent(trimmed)}`}
                  onClick={onClose}
                  className="mt-6 inline-flex text-sm text-gold transition-colors hover:text-champagne"
                >
                  See all {results.length} results →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
