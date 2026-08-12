'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import {
  SHOPPABLE_CATEGORIES,
  SORT_OPTIONS,
  filterProducts,
  getAllProducts,
  getPriceBounds,
  sortProducts,
} from '@/lib/products';
import { cn, formatPrice } from '@/lib/utils';
import ProductGrid from './ProductGrid';
import Button from './ui/Button';
import { CloseIcon, FilterIcon, SearchIcon } from './ui/Icons';

const AVAILABILITY_TABS = [
  { value: 'all', label: 'All Products' },
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'New Arrivals' },
  { value: 'sale', label: 'On Sale' },
];

const ALL_PRODUCTS = getAllProducts();
const BOUNDS = getPriceBounds(ALL_PRODUCTS);

const DEFAULTS = {
  query: '',
  category: 'all',
  availability: 'all',
  sort: 'featured',
  maxPrice: BOUNDS.max,
};

/**
 * The /products browsing experience.
 *
 * Filter state lives in the URL so a filtered view can be linked and shared, and
 * so the header/footer category links land on the right filter. Everything is
 * computed from the local catalogue — no requests.
 */
export default function ProductsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromUrl = {
    query: searchParams.get('q') || DEFAULTS.query,
    category: searchParams.get('category') || DEFAULTS.category,
    availability: searchParams.get('show') || DEFAULTS.availability,
    sort: searchParams.get('sort') || DEFAULTS.sort,
    maxPrice: Number(searchParams.get('max')) || DEFAULTS.maxPrice,
  };

  const [query, setQuery] = useState(fromUrl.query);
  const [category, setCategory] = useState(fromUrl.category);
  const [availability, setAvailability] = useState(fromUrl.availability);
  const [sort, setSort] = useState(fromUrl.sort);
  const [maxPrice, setMaxPrice] = useState(fromUrl.maxPrice);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Follow the URL when it changes from outside this component — a footer
  // category link, the back button, a pasted link. Adjusted during render so
  // the grid never shows one state behind the address bar.
  const urlKey = searchParams.toString();
  const [lastUrlKey, setLastUrlKey] = useState(urlKey);
  if (urlKey !== lastUrlKey) {
    setLastUrlKey(urlKey);
    setQuery(fromUrl.query);
    setCategory(fromUrl.category);
    setAvailability(fromUrl.availability);
    setSort(fromUrl.sort);
    setMaxPrice(fromUrl.maxPrice);
  }

  const pushState = useCallback(
    (next) => {
      const params = new URLSearchParams();
      const merged = { query, category, availability, sort, maxPrice, ...next };

      if (merged.query) params.set('q', merged.query);
      if (merged.category !== DEFAULTS.category) params.set('category', merged.category);
      if (merged.availability !== DEFAULTS.availability) params.set('show', merged.availability);
      if (merged.sort !== DEFAULTS.sort) params.set('sort', merged.sort);
      if (merged.maxPrice !== DEFAULTS.maxPrice) params.set('max', String(merged.maxPrice));

      const search = params.toString();
      router.replace(search ? `/products?${search}` : '/products', { scroll: false });
    },
    [router, query, category, availability, sort, maxPrice],
  );

  const results = useMemo(() => {
    const filtered = filterProducts(ALL_PRODUCTS, {
      query,
      category,
      availability,
      maxPrice: maxPrice < BOUNDS.max ? maxPrice : null,
    });
    // A text query is already relevance-ranked; only re-sort when the shopper
    // has explicitly picked a different order.
    if (query && sort === DEFAULTS.sort) return filtered;
    return sortProducts(filtered, sort);
  }, [query, category, availability, maxPrice, sort]);

  const activeFilterCount =
    (category !== DEFAULTS.category ? 1 : 0) +
    (availability !== DEFAULTS.availability ? 1 : 0) +
    (maxPrice !== DEFAULTS.maxPrice ? 1 : 0);

  function reset() {
    setQuery(DEFAULTS.query);
    setCategory(DEFAULTS.category);
    setAvailability(DEFAULTS.availability);
    setSort(DEFAULTS.sort);
    setMaxPrice(DEFAULTS.maxPrice);
    router.replace('/products', { scroll: false });
  }

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="eyebrow mb-4">Category</legend>
        <ul className="space-y-1">
          <FilterOption
            label="All Categories"
            count={ALL_PRODUCTS.length}
            selected={category === 'all'}
            onSelect={() => {
              setCategory('all');
              pushState({ category: 'all' });
            }}
          />
          {SHOPPABLE_CATEGORIES.map((item) => (
            <FilterOption
              key={item.slug}
              label={item.name}
              count={ALL_PRODUCTS.filter((product) => product.category === item.slug).length}
              selected={category === item.slug}
              onSelect={() => {
                setCategory(item.slug);
                pushState({ category: item.slug });
              }}
            />
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4">Max price</legend>
        <input
          type="range"
          min={BOUNDS.min}
          max={BOUNDS.max}
          step={100}
          value={maxPrice}
          aria-label="Maximum price"
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          onPointerUp={() => pushState({ maxPrice })}
          onKeyUp={() => pushState({ maxPrice })}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate accent-[#c9a227]"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>{formatPrice(BOUNDS.min)}</span>
          <span className="font-medium text-gold">Up to {formatPrice(maxPrice)}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4">Availability</legend>
        <ul className="space-y-1">
          {[...AVAILABILITY_TABS, { value: 'in-stock', label: 'In Stock Only' }].map((tab) => (
            <FilterOption
              key={tab.value}
              label={tab.label}
              selected={availability === tab.value}
              onSelect={() => {
                setAvailability(tab.value);
                pushState({ availability: tab.value });
              }}
            />
          ))}
        </ul>
      </fieldset>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={reset} fullWidth>
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">{filterPanel}</div>
      </aside>

      <div className="min-w-0">
        <h2 className="sr-only">Products</h2>

        {/* Search + sort bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => pushState({ query })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  pushState({ query });
                }
              }}
              placeholder="Search products, categories or tags…"
              aria-label="Search products"
              className="h-12 w-full rounded-full border border-line bg-graphite pl-11 pr-4 text-sm text-cream outline-none transition-colors placeholder:text-faint focus:border-gold/50"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="relative flex h-12 items-center gap-2 rounded-full border border-line bg-graphite px-5 text-xs uppercase tracking-[0.14em] text-cream transition-colors hover:border-gold/45 hover:text-gold lg:hidden"
            >
              <FilterIcon size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-bold text-ink">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative flex-1 sm:flex-none">
              <label htmlFor="sort-products" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-products"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  pushState({ sort: event.target.value });
                }}
                className="h-12 w-full appearance-none rounded-full border border-line bg-graphite pl-5 pr-11 text-xs uppercase tracking-[0.14em] text-cream outline-none transition-colors hover:border-gold/45 focus:border-gold/50 sm:w-56"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-graphite normal-case tracking-normal">
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-faint"
              >
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Quick tabs */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {AVAILABILITY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setAvailability(tab.value);
                pushState({ availability: tab.value });
              }}
              aria-pressed={availability === tab.value}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.14em] transition-colors',
                availability === tab.value
                  ? 'border-gold bg-gold/12 text-gold'
                  : 'border-line text-muted hover:border-gold/40 hover:text-cream',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs text-faint" aria-live="polite">
          Showing {results.length} of {ALL_PRODUCTS.length} products
          {query && <> for “{query}”</>}
        </p>

        <ProductGrid
          products={results}
          columns={3}
          priorityCount={3}
          className="mt-5"
          emptyState={
            <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-line py-20 text-center">
              <SearchIcon size={36} className="text-line" />
              <p className="text-lg text-cream">Nothing matches those filters</p>
              <p className="max-w-sm text-sm text-muted">
                Try widening the price range, clearing the category, or searching for a broader term.
              </p>
              <Button variant="outline" size="sm" onClick={reset} className="mt-2">
                Clear filters
              </Button>
            </div>
          }
        />
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[115] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 animate-fade-in bg-ink/80 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs animate-slide-left flex-col border-l border-line bg-graphite">
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-base text-cream">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-full border border-line p-2 text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                <CloseIcon size={15} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>

            <footer className="border-t border-line px-5 py-4">
              <Button onClick={() => setFiltersOpen(false)} fullWidth>
                Show {results.length} products
              </Button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterOption({ label, count = null, selected, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
          selected ? 'bg-gold/12 text-gold' : 'text-muted hover:bg-white/[0.04] hover:text-cream',
        )}
      >
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors',
              selected ? 'bg-gold' : 'bg-slate',
            )}
          />
          {label}
        </span>
        {count != null && <span className="text-xs text-faint tabular-nums">{count}</span>}
      </button>
    </li>
  );
}
