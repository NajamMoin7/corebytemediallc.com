/**
 * Product categories. `slug` is what the /products page filters on and what the
 * /categories cards link to.
 */

export const CATEGORIES = [
  {
    id: 'cat-tshirts',
    slug: 't-shirts',
    name: 'T-Shirts',
    short: 'Everyday weight, ring-spun cotton.',
    description:
      'Soft ring-spun cotton tees with a clean shoulder line and a print area that holds fine detail. The workhorse of any custom range — equally good for a single personal design or a full team run.',
    image: '/products/classic-core-tee-front.svg',
    from: 26,
  },
  {
    id: 'cat-oversized',
    slug: 'oversized-t-shirts',
    name: 'Oversized T-Shirts',
    short: 'Dropped shoulders, heavier hand-feel.',
    description:
      'A relaxed, longer-body cut with dropped shoulders and a heavier fabric weight. The wider chest panel gives large-format artwork room to breathe.',
    image: '/products/premium-oversized-tee-front.svg',
    from: 36,
  },
  {
    id: 'cat-hoodies',
    slug: 'hoodies',
    name: 'Hoodies',
    short: 'Brushed fleece, structured hood.',
    description:
      'Heavyweight brushed-back fleece with a double-layer hood, ribbed cuffs and a roomy kangaroo pocket. Our most requested piece for brand merchandise.',
    image: '/products/signature-gold-hoodie-front.svg',
    from: 62,
  },
  {
    id: 'cat-sweatshirts',
    slug: 'sweatshirts',
    name: 'Sweatshirts',
    short: 'Classic crew neck, clean silhouette.',
    description:
      'A crew-neck fleece with ribbed collar, cuffs and hem. Cleaner than a hoodie and a natural canvas for centred chest prints and embroidery-style artwork.',
    image: '/products/heritage-crew-sweatshirt-front.svg',
    from: 52,
  },
  {
    id: 'cat-polos',
    slug: 'polo-shirts',
    name: 'Polo Shirts',
    short: 'Piqué knit, corporate-ready.',
    description:
      'Structured piqué polos with a reinforced placket and a flat-knit collar that keeps its shape. The default choice for staff uniforms and corporate gifting.',
    image: '/products/monogram-polo-shirt-front.svg',
    from: 44,
  },
  {
    id: 'cat-caps',
    slug: 'caps',
    name: 'Caps',
    short: 'Structured and low-profile fits.',
    description:
      'Six-panel caps in structured and low-profile fits with an adjustable metal or strap closure. Front-panel artwork prints small and sharp.',
    image: '/products/structured-gold-cap-front.svg',
    from: 24,
  },
  {
    id: 'cat-mugs',
    slug: 'mugs',
    name: 'Mugs',
    short: 'Ceramic, dishwasher safe.',
    description:
      'Glazed ceramic mugs printed with a wrap-around area. Popular for gifting, office sets and small-batch brand merchandise.',
    image: '/products/minimal-logo-mug-front.svg',
    from: 18,
  },
  {
    id: 'cat-totes',
    slug: 'tote-bags',
    name: 'Tote Bags',
    short: 'Heavy cotton canvas, reinforced straps.',
    description:
      'Heavy cotton canvas totes with reinforced stitching at the strap joins and a wide flat print panel. Practical, reusable and hard to get wrong.',
    image: '/products/everyday-canvas-tote-front.svg',
    from: 22,
  },
  {
    id: 'cat-custom',
    slug: 'custom-products',
    name: 'Custom Products',
    short: 'Your artwork, our production.',
    description:
      'Bring your own artwork, logo or photograph and place it on any base product. Upload a file, position it on the live preview, and order exactly what you designed.',
    image: '/mockups/tshirt-black.svg',
    from: 18,
    isCustom: true,
    href: '/customize',
  },
];

/** Categories that map to real catalogue products (excludes the customiser tile). */
export const SHOPPABLE_CATEGORIES = CATEGORIES.filter((category) => !category.isCustom);
