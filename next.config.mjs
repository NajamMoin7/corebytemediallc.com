const isDev = process.env.NODE_ENV === 'development';

/** Collect.js and its card-field iframes are served from the NMI gateway. */
const nmiOrigin = new URL(
  process.env.NEXT_PUBLIC_NMI_COLLECT_JS_URL || 'https://secure.nmi.com/token/Collect.js',
).origin;

/**
 * Content Security Policy without nonces, so pages stay statically rendered.
 * Only this site and the NMI gateway may run scripts, frames or connections.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${nmiOrigin}${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${nmiOrigin}`,
  "font-src 'self'",
  `connect-src 'self' ${nmiOrigin}`,
  `frame-src ${nmiOrigin}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  // Add `includeSubDomains; preload` only once every subdomain serves HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    // Product art currently ships as local SVG mockups in `public/products`.
    // When real photography is available, drop the files into `public/products`
    // (no config change needed) or point `data/products.js` at a CDN and add the
    // host here.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
