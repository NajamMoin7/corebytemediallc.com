'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { searchProducts } from '@/lib/products';
import ProductGrid from './ProductGrid';
import Button from './ui/Button';
import { SearchIcon } from './ui/Icons';

const SUGGESTIONS = ['Hoodie', 'Oversized', 'Mug', 'Cap', 'Tote', 'Sweatshirt'];

/** Full search results page, driven by the `q` query parameter. */
export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);

  // Follow the URL when it changes from outside (back button, a header search).
  // Adjusted during render rather than in an effect so results never render one
  // pass behind the address bar.
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const results = useMemo(() => (query.trim() ? searchProducts(query) : []), [query]);
  const trimmed = query.trim();

  function submit(event) {
    event.preventDefault();
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search', {
      scroll: false,
    });
  }

  return (
    <div>
      <h2 className="sr-only">Search results</h2>

      <form onSubmit={submit} className="relative max-w-2xl">
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the catalogue…"
          aria-label="Search products"
          autoFocus
          className="h-14 w-full rounded-full border border-line bg-graphite pl-13 pr-32 text-sm text-cream outline-none transition-colors placeholder:text-faint focus:border-gold/50"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 h-11 rounded-full bg-gradient-to-br from-champagne via-gold to-gold-dark px-6 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-all hover:brightness-110"
        >
          Search
        </button>
      </form>

      {!trimmed && (
        <div className="mt-10">
          <p className="eyebrow mb-4">Try one of these</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  router.replace(`/search?q=${encodeURIComponent(suggestion)}`, { scroll: false });
                }}
                className="rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-gold/45 hover:text-gold"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {trimmed && (
        <>
          <p className="mt-8 text-sm text-muted" aria-live="polite">
            {results.length === 0
              ? `No results for “${trimmed}”`
              : `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${trimmed}”`}
          </p>

          <ProductGrid
            products={results}
            columns={4}
            priorityCount={4}
            className="mt-6"
            emptyState={
              <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-dashed border-line py-20 text-center">
                <SearchIcon size={36} className="text-line" />
                <p className="text-lg text-cream">Nothing matched that search</p>
                <p className="max-w-sm text-sm leading-relaxed text-muted">
                  We searched product names, categories, descriptions and tags. Try a shorter or more
                  general term — or browse the full catalogue.
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <Button href="/products" size="sm">
                    Browse all products
                  </Button>
                  <Button href="/categories" variant="outline" size="sm">
                    View categories
                  </Button>
                </div>
              </div>
            }
          />
        </>
      )}
    </div>
  );
}
