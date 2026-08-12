import { SITE_URL } from '@/data/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nothing useful to index behind these, and they carry noindex too.
        disallow: ['/cart', '/checkout', '/search'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
