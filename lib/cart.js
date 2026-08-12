import { SHIPPING } from '@/data/site';

/**
 * Cart persistence and maths.
 *
 * The cart lives in localStorage under a single key. Every function here is
 * pure apart from `readCart`/`writeCart`, which are the only two places that
 * touch storage — replacing them with API calls is the whole migration path to
 * a server-side cart.
 */

export const CART_STORAGE_KEY = 'cbm.cart.v1';
export const ORDERS_STORAGE_KEY = 'cbm.orders.v1';
export const CART_EVENT = 'cbm:cart-updated';

const MAX_QUANTITY = 99;

/**
 * Identity of a cart line. Two entries merge only when they are the same
 * product in the same size and colour — and custom items never merge, because
 * each carries its own artwork.
 */
export function lineKey(item) {
  if (item.custom) return item.key;
  return [item.productId, item.size || '-', item.color || '-'].join('::');
}

const EMPTY_CART = [];

/**
 * The cart is a small external store that React subscribes to with
 * `useSyncExternalStore`. localStorage is the persistence layer, but `current`
 * is the authoritative value — so the cart keeps working even where storage is
 * blocked (private browsing) or full.
 *
 * `getSnapshot` runs on every render and React bails out only on referential
 * equality, so this must return the same array until something actually
 * changes. Never parse JSON directly in `readCart`.
 */
let current = null; // null means "not loaded from storage yet"

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidLine) : EMPTY_CART;
  } catch {
    // Corrupt or unreadable storage should never break the store.
    return EMPTY_CART;
  }
}

export function readCart() {
  if (typeof window === 'undefined') return EMPTY_CART;
  if (current === null) current = loadFromStorage();
  return current;
}

/** Server render has no cart; a stable reference keeps the snapshot check happy. */
export function readServerCart() {
  return EMPTY_CART;
}

export function writeCart(items) {
  if (typeof window === 'undefined') return;

  current = items;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Persistence failed, but `current` is already updated so this visit is fine.
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

/** Subscribes to cart changes from this tab and from other tabs. */
export function subscribeToCart(onChange) {
  function onStorage(event) {
    if (event.key && event.key !== CART_STORAGE_KEY) return;
    // Another tab wrote to storage — drop our copy and re-read on next snapshot.
    current = null;
    onChange();
  }

  window.addEventListener(CART_EVENT, onChange);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

function isValidLine(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.key === 'string' &&
    typeof item.name === 'string' &&
    Number.isFinite(Number(item.unitPrice)) &&
    Number(item.quantity) > 0
  );
}

/** Normalises a product + selection into a cart line. */
export function toCartLine({
  product,
  size = null,
  color = null,
  quantity = 1,
  custom = null,
  image = null,
  unitPrice = null,
}) {
  const base = {
    productId: product?.id ?? null,
    slug: product?.slug ?? null,
    name: product?.name ?? 'Custom Product',
    image: image || product?.images?.[0]?.src || null,
    size,
    color,
    quantity: clampQuantity(quantity),
    unitPrice: unitPrice ?? product?.salePrice ?? product?.price ?? 0,
    listPrice: product?.price ?? null,
    custom,
  };
  return { ...base, key: custom ? custom.key : lineKey(base) };
}

export function clampQuantity(value) {
  const quantity = Math.round(Number(value) || 0);
  if (quantity < 1) return 1;
  return Math.min(quantity, MAX_QUANTITY);
}

export function addLine(items, line) {
  const existing = items.findIndex((item) => item.key === line.key);
  if (existing === -1) return [...items, line];

  const next = [...items];
  next[existing] = {
    ...next[existing],
    quantity: clampQuantity(next[existing].quantity + line.quantity),
  };
  return next;
}

export function updateLineQuantity(items, key, quantity) {
  if (quantity < 1) return removeLine(items, key);
  return items.map((item) =>
    item.key === key ? { ...item, quantity: clampQuantity(quantity) } : item,
  );
}

export function removeLine(items, key) {
  return items.filter((item) => item.key !== key);
}

export function cartCount(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function cartSubtotal(items) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

/**
 * Shipping quote. Free above the configured threshold, flat rate otherwise,
 * and nothing at all for an empty cart.
 */
export function shippingCost(subtotal) {
  if (subtotal <= 0) return 0;
  if (SHIPPING.freeThreshold && subtotal >= SHIPPING.freeThreshold) return 0;
  return SHIPPING.flatRate;
}

export function cartTotals(items, { paymentMethod = 'cod' } = {}) {
  const subtotal = cartSubtotal(items);
  const shipping = shippingCost(subtotal);
  const codFee = paymentMethod === 'cod' ? SHIPPING.codSurcharge || 0 : 0;
  return {
    subtotal,
    shipping,
    codFee,
    total: subtotal + shipping + codFee,
    count: cartCount(items),
    freeShippingRemaining:
      SHIPPING.freeThreshold && subtotal > 0 && subtotal < SHIPPING.freeThreshold
        ? SHIPPING.freeThreshold - subtotal
        : 0,
  };
}

/**
 * Stores the placed order so the confirmation page can render after the cart is
 * cleared. Demo persistence only — a real deployment posts this to an order
 * management system.
 */
export function saveOrder(order) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.sessionStorage.getItem(ORDERS_STORAGE_KEY);
    const orders = raw ? JSON.parse(raw) : [];
    window.sessionStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify([order, ...(Array.isArray(orders) ? orders : [])].slice(0, 10)),
    );
  } catch {
    // Non-fatal: the confirmation screen is rendered from state on this journey.
  }
}

