'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Slim gold progress bar shown while a route transition is in flight.
 *
 * Why this rather than `loading.js`: every route here is statically prerendered
 * and prefetched, so a route-level Suspense fallback is never actually seen on
 * navigation — but it *does* force the server HTML for each page to be the
 * fallback, with the real content streamed in afterwards. That costs LCP and
 * leaves crawlers without JS looking at a spinner. This gives the same feedback
 * on a slow connection while every page still ships complete HTML.
 *
 * The bar starts on a click of an internal link and completes when the route
 * actually changes, so it also covers back/forward navigation.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  // Complete once the new route is committed. Adjusted during render so the bar
  // clears in the same pass that paints the new page.
  const routeKey = `${pathname}?${searchParams}`;
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    setActive(false);
  }

  // Start on any click that will cause a same-origin navigation.
  useEffect(() => {
    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target.closest?.('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      // Same page, or only a hash change — no transition to report.
      if (destination.pathname + destination.search === pathname + window.location.search) return;

      setActive(true);
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[140] h-0.5 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`h-full origin-left bg-gradient-to-r from-gold-dark via-gold to-champagne ${
          active ? 'animate-nav-progress' : 'scale-x-0'
        }`}
      />
    </div>
  );
}
