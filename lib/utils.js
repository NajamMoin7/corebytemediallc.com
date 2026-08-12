import { CURRENCY } from '@/data/site';

/** Joins class names, dropping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number as a display price, e.g. `$28.00`.
 * Uses Intl so the symbol, separators and placement follow the configured
 * locale rather than being hard-coded.
 */
const priceFormatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: 'currency',
  currency: CURRENCY.code,
  minimumFractionDigits: CURRENCY.decimals,
  maximumFractionDigits: CURRENCY.decimals,
});

export function formatPrice(value) {
  return priceFormatter.format(Number(value) || 0);
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

/**
 * US phone numbers, accepting the formats people actually type:
 *   (555) 123-4567 · 555-123-4567 · 555.123.4567 · 5551234567 · +1 555 123 4567
 * Deliberately permissive about punctuation and strict only about digit count.
 */
export function isValidPhone(value) {
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 10) return true;
  // 11 digits is only valid as a +1 country code.
  return digits.length === 11 && digits.startsWith('1');
}

/** Formats 10 digits as (555) 123-4567, leaving anything else untouched. */
export function formatPhone(value) {
  const digits = String(value).replace(/\D/g, '');
  const local = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (local.length !== 10) return value;
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

/** US ZIP codes: five digits, optionally with a four-digit extension. */
export function isValidZipCode(value) {
  return /^\d{5}(-\d{4})?$/.test(String(value).trim());
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
