'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { Skeleton } from './ui/LoadingSpinner';
import { CartIcon, ArrowLeftIcon } from './ui/Icons';

export default function CartView() {
  const { items, totals, hydrated, updateQuantity, removeItem, clearCart } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  // The cart is read from localStorage after mount, so show a placeholder until
  // the real contents are known rather than flashing the empty state.
  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
        <div className="space-y-4">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-40 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-line py-24 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full border border-line text-line">
          <CartIcon size={40} />
        </span>
        <div className="space-y-2">
          <h2 className="text-2xl text-cream">Your cart is empty</h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
            Nothing here yet. Browse the catalogue, or start from a blank product and put your own
            design on it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/products">Shop Products</Button>
          <Button href="/customize" variant="outline">
            Customize a Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
              {totals.count} {totals.count === 1 ? 'item' : 'items'}
            </h2>
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="text-xs text-faint transition-colors hover:text-red-400"
            >
              Clear cart
            </button>
          </div>

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/products" variant="ghost" size="sm" className="-ml-4">
              <ArrowLeftIcon size={15} />
              Continue shopping
            </Button>
          </div>
        </div>

        <div>
          <CartSummary totals={totals} />
        </div>
      </div>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear your cart?"
        description="This removes every item, including any customised products and their design settings."
        size="sm"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
              Keep items
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
            >
              Clear cart
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          You will need to add the items again — including re-uploading artwork for any custom
          products.
        </p>
      </Modal>
    </>
  );
}
