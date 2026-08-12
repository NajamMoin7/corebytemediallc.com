'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import {
  addLine,
  cartTotals,
  readCart,
  readServerCart,
  removeLine,
  subscribeToCart,
  toCartLine,
  updateLineQuantity,
  writeCart,
} from '@/lib/cart';
import { useIsHydrated } from '@/lib/hooks';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // The cart lives in an external store (localStorage + an in-memory copy) so
  // every consumer sees the same value without an effect-driven hydration pass.
  const items = useSyncExternalStore(subscribeToCart, readCart, readServerCart);
  const hydrated = useIsHydrated();

  const addItem = useCallback(
    (payload, { silent = false, openDrawer = false } = {}) => {
      const line = payload.key ? payload : toCartLine(payload);
      writeCart(addLine(readCart(), line));

      if (!silent) {
        toast({
          title: `${line.name} added to your cart.`,
          description: [line.size, line.color].filter(Boolean).join(' · ') || undefined,
          variant: 'success',
        });
      }
      if (openDrawer) setDrawerOpen(true);
      return line;
    },
    [toast],
  );

  const updateQuantity = useCallback((key, quantity) => {
    writeCart(updateLineQuantity(readCart(), key, quantity));
  }, []);

  const removeItem = useCallback(
    (key) => {
      const currentItems = readCart();
      const target = currentItems.find((item) => item.key === key);
      writeCart(removeLine(currentItems, key));

      if (target) {
        toast({ title: `${target.name} removed from your cart.` });
      }
    },
    [toast],
  );

  const clearCart = useCallback(() => {
    writeCart([]);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const totals = useMemo(() => cartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      hydrated,
      totals,
      count: totals.count,
      drawerOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    }),
    [
      items,
      hydrated,
      totals,
      drawerOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openDrawer,
      closeDrawer,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return context;
}
