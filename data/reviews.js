/**
 * SAMPLE CONTENT.
 *
 * These testimonials are written demo content used to show the storefront
 * layout. They are not real customer reviews. Replace them with genuine,
 * attributable feedback before launch — the UI labels this section as sample
 * content while `IS_SAMPLE_CONTENT` is true.
 */

export const IS_SAMPLE_CONTENT = true;

export const TESTIMONIALS = [
  {
    id: 'rev-1',
    name: 'Ayesha R.',
    location: 'Lahore',
    rating: 5,
    product: 'Signature Gold Hoodie',
    productSlug: 'signature-gold-hoodie',
    title: 'The fleece is the real thing',
    body: 'I ordered two for my team and expected the usual thin fleece you get at this price. It is genuinely heavy, and the gold print has not cracked after a month of washing. Sizing ran true for both of us.',
  },
  {
    id: 'rev-2',
    name: 'Hamza K.',
    location: 'Karachi',
    rating: 5,
    product: 'Premium Oversized Tee',
    productSlug: 'premium-oversized-tee',
    title: 'Finally an oversized cut that fits properly',
    body: 'Most oversized tees are just a size up. This one is actually patterned for the fit — the shoulder seam sits where it should. Printed my own artwork across the chest and the detail held up.',
  },
  {
    id: 'rev-3',
    name: 'Sana M.',
    location: 'Islamabad',
    rating: 4,
    product: 'Minimal Logo Mug',
    productSlug: 'minimal-logo-mug',
    title: 'Good gift set, quick turnaround',
    body: 'Ordered a set of six for the office. They arrived in four days, well packed, no chips. Would have liked a slightly wider handle on the 15 oz but the print quality is excellent.',
  },
  {
    id: 'rev-4',
    name: 'Bilal A.',
    location: 'Rawalpindi',
    rating: 5,
    product: 'Classic Core Tee',
    productSlug: 'classic-core-tee',
    title: 'Bought three more after the first one',
    body: 'The collar has not gone loose, which is the thing that usually kills a tee for me. Cash on delivery was straightforward and the rider called ahead.',
  },
  {
    id: 'rev-5',
    name: 'Zainab F.',
    location: 'Faisalabad',
    rating: 5,
    product: 'Everyday Canvas Tote',
    productSlug: 'everyday-canvas-tote',
    title: 'Straps are properly reinforced',
    body: 'I have torn the straps off two other totes carrying books. This one has bar-tacking at the joins and it has held fine. Uploaded a design through the customiser and the preview matched what arrived.',
  },
  {
    id: 'rev-6',
    name: 'Usman T.',
    location: 'Multan',
    rating: 4,
    product: 'Heritage Crew Sweatshirt',
    productSlug: 'heritage-crew-sweatshirt',
    title: 'Warm without being bulky',
    body: 'Ordered the charcoal. Colour is accurate to the site. Took five days to reach Multan which was a day longer than estimated, but they messaged about it.',
  },
];

/**
 * Per-product review excerpts shown on the product detail page.
 * Also sample content.
 */
export const PRODUCT_REVIEWS = {
  'classic-core-tee': [
    {
      name: 'Bilal A.',
      rating: 5,
      date: 'December 2025',
      body: 'Third one I have ordered. Collar holds its shape, print still sharp.',
    },
    {
      name: 'Nida S.',
      rating: 5,
      date: 'November 2025',
      body: 'True to size. The black is a proper black, not a faded grey.',
    },
    {
      name: 'Faisal M.',
      rating: 4,
      date: 'November 2025',
      body: 'Good tee for the price. Slightly longer in the body than I expected.',
    },
  ],
  'signature-gold-hoodie': [
    {
      name: 'Ayesha R.',
      rating: 5,
      date: 'January 2026',
      body: 'Heavy fleece, hood actually stands up. Worth the price.',
    },
    {
      name: 'Omar J.',
      rating: 5,
      date: 'December 2025',
      body: 'The gold print is subtle rather than loud, which is what I wanted.',
    },
  ],
  'premium-oversized-tee': [
    {
      name: 'Hamza K.',
      rating: 5,
      date: 'January 2026',
      body: 'Patterned for the fit rather than just sized up. Big difference.',
    },
    {
      name: 'Mahnoor A.',
      rating: 5,
      date: 'December 2025',
      body: 'Ordered the bone colourway. Heavy fabric, no transparency.',
    },
  ],
};

export function getProductReviews(slug) {
  return PRODUCT_REVIEWS[slug] || [];
}
