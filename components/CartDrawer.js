'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { SHIPPING } from '@/data/site';
import Button from './ui/Button';
import { QuantitySelector } from './ProductOptions';
import { CartIcon, CloseIcon, TrashIcon } from './ui/Icons';

/** Slide-in cart panel opened from the header. */
export default function CartDrawer() {
  const { items, totals, drawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event) {
      if (event.key === 'Escape') closeDrawer();
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[115]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 animate-fade-in bg-ink/80 backdrop-blur-sm" onClick={closeDrawer} aria-hidden="true" />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-left flex-col border-l border-line bg-graphite shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2.5 text-lg text-cream">
            <CartIcon size={18} className="text-gold" />
            Your Cart
            <span className="text-sm text-faint">({totals.count})</span>
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="rounded-full border border-line p-2 text-muted transition-colors hover:border-gold/50 hover:text-gold"
          >
            <CloseIcon size={15} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line text-line">
              <CartIcon size={34} />
            </span>
            <div className="space-y-2">
              <p className="text-lg text-cream">Your cart is empty</p>
              <p className="text-sm text-muted">
                Browse the catalogue or start from a blank product and add your own design.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2.5 pt-2">
              <Button href="/products" onClick={closeDrawer} fullWidth>
                Shop Products
              </Button>
              <Button href="/customize" variant="outline" onClick={closeDrawer} fullWidth>
                Customize a Product
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border border-line bg-obsidian">
                    {item.image && (
                      <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                    )}
                    {item.custom?.artwork && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.custom.artwork}
                          alt=""
                          className="max-h-[38%] max-w-[46%] object-contain"
                        />
                      </span>
                    )}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        {item.slug ? (
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeDrawer}
                            className="block truncate text-sm text-cream transition-colors hover:text-gold"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <span className="block truncate text-sm text-cream">{item.name}</span>
                        )}
                        <span className="mt-0.5 block text-xs text-faint">
                          {[item.size, item.color].filter(Boolean).join(' · ')}
                        </span>
                        {item.custom && (
                          <span className="mt-1 inline-block rounded border border-gold/35 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-gold">
                            Custom design
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="shrink-0 rounded p-1 text-faint transition-colors hover:text-red-400"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(next) => updateQuantity(item.key, next)}
                        size="sm"
                      />
                      <span className="text-sm font-medium text-gold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-4 border-t border-line bg-charcoal/40 px-5 py-5">
              {totals.freeShippingRemaining > 0 && (
                <p className="rounded-lg border border-gold/25 bg-gold/[0.06] px-3 py-2.5 text-xs text-champagne">
                  Add {formatPrice(totals.freeShippingRemaining)} more for free shipping.
                </p>
              )}

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="text-cream">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-cream">
                    {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2.5 text-base">
                  <dt className="text-cream">Total</dt>
                  <dd className="font-semibold text-gold">{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              {SHIPPING.isDemoPricing && (
                <p className="text-[0.65rem] leading-relaxed text-faint">
                  Shipping rates shown are example values configured in one place and can be changed
                  at any time.
                </p>
              )}

              <div className="flex flex-col gap-2.5">
                <Button href="/checkout" onClick={closeDrawer} fullWidth>
                  Proceed to Checkout
                </Button>
                <Button href="/cart" variant="ghost" onClick={closeDrawer} fullWidth size="sm">
                  View full cart
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body,
  );
}
