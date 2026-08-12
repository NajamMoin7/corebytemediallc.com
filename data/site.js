/**
 * Single source of truth for brand, contact, shipping and legal configuration.
 *
 * Everything here is deliberately kept out of the components so the store can be
 * re-pointed (new phone number, new shipping rate, new logo file) without
 * touching UI code.
 */

export const SITE_URL = 'https://corebytemediallc.com';

export const BRAND = {
  name: 'Core Byte Media LLC',
  shortName: 'Core Byte Media',
  legalName: 'Core Byte Media LLC',
  tagline: 'Designed for You. Made to Stand Out.',
  description:
    'Core Byte Media LLC is a print-on-demand studio producing premium custom apparel and accessories. Choose a product, upload your design, and we print and ship it for you.',
};

/**
 * The site reads its logo from here and nowhere else.
 *
 * NOTE: the files currently referenced are placeholder marks. Replace them with
 * the official Core Byte Media LLC artwork (same paths, or update these values)
 * and the header, footer, loader and order confirmation all pick it up.
 */
export const LOGO = {
  full: '/logo/core-byte-media-logo.svg',
  fullWidth: 640,
  fullHeight: 160,
  mark: '/logo/core-byte-media-mark.svg',
  markSize: 128,
  alt: 'Core Byte Media LLC',
};

/**
 * Contact details. Replace with the live business details before launch —
 * these are configuration placeholders, not verified contact points.
 */
export const CONTACT = {
  email: 'info@corebytemediallc.com',
  supportEmail: 'support@corebytemediallc.com',
  phoneDisplay: '+92 300 0000000',
  phoneHref: '+923000000000',
  hours: [
    { days: 'Monday – Friday', time: '9:00 AM – 6:00 PM (PKT)' },
    { days: 'Saturday', time: '11:00 AM – 4:00 PM (PKT)' },
    { days: 'Sunday', time: 'Closed' },
  ],
  location: {
    line1: 'Core Byte Media LLC',
    line2: 'Online print-on-demand studio',
    city: 'Serving customers across Pakistan',
  },
  responseTime: 'We usually reply within one business day.',
};

/**
 * Social profiles. `href: null` renders a non-clickable placeholder — fill in
 * the real URLs when the profiles exist rather than pointing at guessed handles.
 */
export const SOCIAL = [
  { key: 'instagram', label: 'Instagram', href: null },
  { key: 'facebook', label: 'Facebook', href: null },
  { key: 'x', label: 'X', href: null },
  { key: 'tiktok', label: 'TikTok', href: null },
  { key: 'linkedin', label: 'LinkedIn', href: null },
];

export const CURRENCY = {
  code: 'PKR',
  symbol: 'Rs',
  locale: 'en-PK',
};

/**
 * Shipping configuration.
 *
 * DEMO VALUES — these rates are examples for the storefront. Change the numbers
 * here and every quote across cart, checkout and the shipping page updates.
 */
export const SHIPPING = {
  isDemoPricing: true,
  flatRate: 250,
  freeThreshold: 5000,
  codSurcharge: 0,
  estimate: {
    processingDays: '1 – 3 business days',
    majorCities: '2 – 4 business days',
    otherAreas: '4 – 7 business days',
    remoteAreas: '5 – 10 business days',
  },
  majorCities: [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
  ],
  codAvailable: true,
  codMaxOrderValue: 50000,
};

export const RETURNS = {
  windowDays: 7,
  inspectionDays: 2,
  refundDays: '7 – 10 business days',
};

export const COUNTRIES = [
  'Pakistan',
  'United Arab Emirates',
  'Saudi Arabia',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Qatar',
  'Oman',
  'Bahrain',
  'Kuwait',
  'Malaysia',
  'Turkey',
];

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir',
];

/** Last review date shown on the policy pages. */
export const POLICY_UPDATED = 'January 2026';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/customize', label: 'Customize' },
  { href: '/contact', label: 'Contact' },
];

export const FOOTER_LINKS = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/products', label: 'Products' },
    { href: '/customize', label: 'Customize' },
  ],
  support: [
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping Information' },
    { href: '/returns', label: 'Return & Refund Policy' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  ],
  products: [
    { href: '/products?category=t-shirts', label: 'T-Shirts' },
    { href: '/products?category=hoodies', label: 'Hoodies' },
    { href: '/products?category=mugs', label: 'Mugs' },
    { href: '/products?category=caps', label: 'Caps' },
    { href: '/customize', label: 'Custom Products' },
  ],
};
