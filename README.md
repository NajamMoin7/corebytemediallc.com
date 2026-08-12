# Core Byte Media LLC — Print-on-Demand Storefront

A static, front-end-only e-commerce site for **corebytemediallc.com**, built with Next.js 16
(App Router), Tailwind CSS v4 and JavaScript. There is no backend: the catalogue is local data,
the cart lives in `localStorage`, and orders are completed client-side with Cash on Delivery.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (43 static routes)
npm run start    # serve the production build
npm run lint
npm run assets   # regenerate the product mockup SVGs
```

---

## Read this first

### The logo is a placeholder

No logo file was supplied, so `public/logo/core-byte-media-logo.svg` and
`core-byte-media-mark.svg` are neutral gold/black placeholder marks.

**To install the real logo:** drop your file into `public/logo/` and update `LOGO` in
[`data/site.js`](data/site.js). That object is the only place the site reads its logo from —
the header, footer, order confirmation and favicon all follow it. The artwork is never
recoloured, filtered or stretched in code; it is rendered at its natural aspect ratio and only
scaled.

### Placeholder values to replace before launch

| What | Where |
| --- | --- |
| Phone number, email addresses, business hours, location | `CONTACT` in `data/site.js` |
| Social media URLs (currently `null` → rendered as inert, not fake links) | `SOCIAL` in `data/site.js` |
| Shipping rates and free-shipping threshold (example values) | `SHIPPING` in `data/site.js` |
| Return window and refund timings | `RETURNS` in `data/site.js` |
| Customer testimonials (clearly labelled sample content in the UI) | `data/reviews.js` |
| Product mockup art (generated SVGs, not photography) | `public/products/`, `public/mockups/` |

---

## Project structure

```
app/                      Routes. Every page is statically prerendered.
  page.js                 Home
  about/ products/ products/[slug]/ categories/ customize/
  cart/ checkout/ contact/ search/
  faq/ shipping/ returns/ privacy-policy/ terms-and-conditions/
  layout.js  error.js  not-found.js  sitemap.js  robots.js  icon.svg

components/               UI. `ui/` holds the primitives, `home/` the homepage sections.
context/                  CartContext, ToastContext
data/                     products, categories, customize bases, reviews, faqs, size guides, site config
lib/                      cart (persistence + maths), products (queries), customize, utils, hooks
public/products/          Generated product mockups (4 views + colourways per product)
public/mockups/           Blank bases used by the customiser
scripts/generate-assets.mjs
```

### Where to connect a backend later

The code is deliberately seamed so a backend drops in without touching the UI:

| Concern | Swap this |
| --- | --- |
| Catalogue | The function bodies in `lib/products.js` — nothing in the UI reads `data/products.js` directly |
| Cart | `readCart` / `writeCart` / `subscribeToCart` in `lib/cart.js` (the only code touching storage) |
| Artwork upload | `readArtwork` in `lib/customize.js`; the cart line already carries `custom.uploaded: false` |
| Order placement | The `setTimeout` block in `components/CheckoutView.js` marked as the order-API seam |
| Newsletter / contact | `handleSubmit` in `components/NewsletterForm.js` and `components/ContactForm.js` |

---

## Payment

**Cash on Delivery is the only working method.** The card option is rendered at checkout so the
UI is ready for a gateway, but it is disabled: selecting it opens a "Card Payment is Currently
Unavailable" dialog and cannot place an order. No card fields exist anywhere in this codebase —
nothing is collected, transmitted, stored or simulated.

---

## Product artwork

The site ships with zero external image dependencies. `npm run assets` generates 156 SVG
mockups into `public/products` and `public/mockups` from the geometry in
`scripts/generate-assets.mjs`, so no image can 404 and no CDN is required.

To use real photography, replace the files in `public/products/` keeping the same filenames
(`<slug>-front.svg` etc.), or point the `images` arrays in `data/products.js` at new paths. For
a remote CDN, add the host to `images.remotePatterns` in `next.config.mjs`.

The customiser's print panel per product is four numbers — `printArea: { cx, cy, w, h }` in
`data/customize.js`, as percentages of the mockup box. Change the mockup, change those numbers.

---

## Notes on a few decisions

**No `loading.js` files.** Every route here is statically prerendered and prefetched, so a
route-level Suspense fallback is never actually seen on navigation — but it *does* force each
page's server HTML to be the fallback, with real content streamed in behind it. That costs LCP
and leaves non-JS crawlers looking at a spinner. Instead there is a global gold progress bar
(`components/NavigationProgress.js`) for slow connections, and the reusable branded loader in
`components/ui/LoadingSpinner.js` is used at the real async boundaries.

**`/products` prerenders its full grid.** The filter UI needs `useSearchParams`, which requires
a Suspense boundary. The boundary's fallback renders the actual unfiltered catalogue rather than
a spinner, so the static HTML contains every product and the interactive filters take over on
hydration.

**No icon or animation dependencies.** The ~30 icons used are inline SVG in
`components/ui/Icons.js`; animations are CSS keyframes registered through Tailwind v4's
`@theme`, with `prefers-reduced-motion` honoured globally in `app/globals.css`.

**Uploaded artwork never leaves the browser.** The customiser reads files with `FileReader` and
keeps them as data URLs. This is stated plainly to the customer in the customiser, the FAQ,
the privacy policy and on the order confirmation, which tells them we will email to collect the
original file.
