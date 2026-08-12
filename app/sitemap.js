import { SITE_URL } from '@/data/site';
import { getAllProducts } from '@/lib/products';

/**
 * Static routes with a hand-set priority, plus every product page.
 * Cart, checkout and search are excluded — they carry `noindex`.
 */
const STATIC_ROUTES = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/categories', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/customize', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/faq', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/shipping', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/returns', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap() {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getAllProducts().map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
