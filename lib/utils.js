import { CURRENCY } from '@/data/site';

/** Joins class names, dropping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** Formats a number as a display price, e.g. `Rs 2,490`. */
export function formatPrice(value) {
  const amount = Number(value) || 0;
  return `${CURRENCY.symbol} ${amount.toLocaleString(CURRENCY.locale, {
    maximumFractionDigits: 0,
  })}`;
}

/** The price actually charged for a product (sale price when present). */
export function effectivePrice(product) {
  return product?.salePrice ?? product?.price ?? 0;
}

/** Whole-number discount percentage, or null when there is no sale price. */
export function discountPercent(product) {
  if (!product?.salePrice || !product?.price || product.salePrice >= product.price) {
    return null;
  }
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Client-side demo order number. A real backend would issue this and guarantee
 * uniqueness — this only needs to be unique enough to reference a session.
 */
export function generateOrderNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 90000 + 10000);
  return `CBM-${stamp}-${random}`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date instanceof Date ? date : new Date(date));
}

/** Basic, permissive email shape check — server-side validation still required. */
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}

/** Accepts common Pakistani formats plus international numbers. */
export function isValidPhone(value) {
  const digits = String(value).replace(/[^\d]/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
