'use client';

import { Suspense } from 'react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ToastViewport from './ui/Toast';
import CartDrawer from './CartDrawer';
import NavigationProgress from './NavigationProgress';

/**
 * Client-side application shell. Toasts wrap the cart because adding to the cart
 * raises a toast.
 */
export default function Providers({ children }) {
  return (
    <ToastProvider>
      <CartProvider>
        {/* Reads search params, so it needs its own boundary to avoid opting
            the whole tree into dynamic rendering. */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <CartDrawer />
        <ToastViewport />
      </CartProvider>
    </ToastProvider>
  );
}
