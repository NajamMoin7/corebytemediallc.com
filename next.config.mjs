/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product art currently ships as local SVG mockups in `public/products`.
    // When real photography is available, drop the files into `public/products`
    // (no config change needed) or point `data/products.js` at a CDN and add the
    // host here.
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
