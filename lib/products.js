import { PRODUCTS } from '@/data/products';
import { CATEGORIES, SHOPPABLE_CATEGORIES } from '@/data/categories';
import { effectivePrice } from './utils';

/**
 * Catalogue queries.
 *
 * These read from the local data file today. Swapping in a real backend means
 * replacing the bodies of these functions — nothing in the UI reaches past this
 * module to the raw data.
 */

export function getAllProducts() {
  return PRODUCTS;
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((product) => product.slug === slug) || null;
}

export function getProductsByCategory(categorySlug) {
  return PRODUCTS.filter((product) => product.category === categorySlug);
}

export function getFeaturedProducts(limit = 8) {
  return PRODUCTS.filter((product) => product.featured).slice(0, limit);
}

export function getNewArrivals(limit = 8) {
  return PRODUCTS.filter((product) => product.isNew).slice(0, limit);
}

export function getSaleProducts(limit = 8) {
  return PRODUCTS.filter((product) => product.salePrice).slice(0, limit);
}

/** Same category first, then anything else, excluding the product itself. */
export function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  const sameCategory = PRODUCTS.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const fillers = PRODUCTS.filter(
    (item) => item.id !== product.id && item.category !== product.category,
  ).slice(0, limit - sameCategory.length);

  return [...sameCategory, ...fillers];
}

export function getCategoryName(slug) {
  return CATEGORIES.find((category) => category.slug === slug)?.name || slug;
}

export function getPriceBounds(products = PRODUCTS) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map(effectivePrice);
  return {
    min: Math.floor(Math.min(...prices) / 100) * 100,
    max: Math.ceil(Math.max(...prices) / 100) * 100,
  };
}

/**
 * Free-text search across name, category, description and tags.
 * Results are ranked so a name match outranks a description match.
 */
export function searchProducts(query, products = PRODUCTS) {
  const term = String(query || '').trim().toLowerCase();
  if (!term) return [];

  const words = term.split(/\s+/).filter(Boolean);

  return products
    .map((product) => {
      const name = product.name.toLowerCase();
      const category = getCategoryName(product.category).toLowerCase();
      const description = `${product.description} ${product.longDescription}`.toLowerCase();
      const tags = product.tags.join(' ').toLowerCase();

      let score = 0;
      for (const word of words) {
        if (name.includes(word)) score += name.startsWith(word) ? 10 : 6;
        if (category.includes(word)) score += 4;
        if (tags.includes(word)) score += 3;
        if (description.includes(word)) score += 1;
      }
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
}

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

export function sortProducts(products, sortBy) {
  const list = [...products];
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case 'price-desc':
      return list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case 'newest':
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
    case 'featured':
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
  }
}

/**
 * Applies the /products page filter set.
 * `availability` accepts 'all' | 'featured' | 'new' | 'sale' | 'in-stock'.
 */
export function filterProducts(products, filters = {}) {
  const {
    query = '',
    category = 'all',
    minPrice = null,
    maxPrice = null,
    availability = 'all',
  } = filters;

  let result = query ? searchProducts(query, products) : [...products];

  if (category && category !== 'all') {
    result = result.filter((product) => product.category === category);
  }

  if (minPrice != null) {
    result = result.filter((product) => effectivePrice(product) >= minPrice);
  }
  if (maxPrice != null) {
    result = result.filter((product) => effectivePrice(product) <= maxPrice);
  }

  switch (availability) {
    case 'featured':
      result = result.filter((product) => product.featured);
      break;
    case 'new':
      result = result.filter((product) => product.isNew);
      break;
    case 'sale':
      result = result.filter((product) => Boolean(product.salePrice));
      break;
    case 'in-stock':
      result = result.filter((product) => product.inStock);
      break;
    default:
      break;
  }

  return result;
}

export { CATEGORIES, SHOPPABLE_CATEGORIES };
