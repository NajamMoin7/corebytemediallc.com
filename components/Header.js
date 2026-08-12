'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_LINKS } from '@/data/site';
import { useCart } from '@/context/CartContext';
import { useScrolledPast } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from './ui/Icons';

export default function Header() {
  const pathname = usePathname();
  const { count, hydrated, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Solid, blurred background once the page has scrolled past the hero edge.
  const scrolled = useScrolledPast(12);

  // Close the mobile menu whenever the route changes. Adjusted during render so
  // the panel is gone in the same pass that paints the new page.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  function isActive(href) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'sticky top-0 z-[100] w-full transition-all duration-400',
          scrolled
            ? 'border-b border-line bg-ink/85 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/70'
            : 'border-b border-transparent bg-gradient-to-b from-ink/90 to-transparent',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
          {/* The supplied lockup is stacked, so its wordmark is unreadable at
              header scale — the hexagon mark is used here and the full lockup
              appears wherever there is room for it. */}
          <Logo
            variant="mark"
            height={scrolled ? 34 : 40}
            priority
            className="transition-all duration-400"
          />

          <nav aria-label="Main navigation" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative block px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300',
                        active ? 'text-gold' : 'text-cream/75 hover:text-cream',
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-4 bottom-0.5 h-px origin-left bg-gold transition-transform duration-300',
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="rounded-full p-2.5 text-cream/80 transition-colors hover:bg-white/5 hover:text-gold"
            >
              <SearchIcon size={19} />
            </button>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={hydrated && count > 0 ? `Open cart, ${count} items` : 'Open cart'}
              className="relative rounded-full p-2.5 text-cream/80 transition-colors hover:bg-white/5 hover:text-gold"
            >
              <CartIcon size={19} />
              {hydrated && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] animate-scale-in items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-bold tabular-nums text-ink">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="rounded-full p-2.5 text-cream/80 transition-colors hover:bg-white/5 hover:text-gold lg:hidden"
            >
              {menuOpen ? <CloseIcon size={19} /> : <MenuIcon size={19} />}
            </button>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            'block h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent transition-opacity duration-500',
            scrolled ? 'opacity-100' : 'opacity-0',
          )}
        />
      </header>

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-x-0 top-16 z-[99] lg:hidden',
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-screen bg-ink/70 backdrop-blur-sm transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <nav
          aria-label="Mobile navigation"
          className={cn(
            'relative border-b border-line bg-graphite/98 backdrop-blur-xl transition-all duration-300',
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
          )}
        >
          <ul className="container-page flex flex-col py-2">
            {NAV_LINKS.map((link, index) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="border-b border-line/60 last:border-0">
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    style={{ transitionDelay: menuOpen ? `${index * 40}ms` : '0ms' }}
                    className={cn(
                      'flex items-center justify-between py-4 text-sm uppercase tracking-[0.16em] transition-all duration-300',
                      active ? 'text-gold' : 'text-cream/80',
                      menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0',
                    )}
                  >
                    {link.label}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="container-page pb-5 pt-1">
            <Link
              href="/customize"
              className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-br from-champagne via-gold to-gold-dark text-xs font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Start a Custom Design
            </Link>
          </div>
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
