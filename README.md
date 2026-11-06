# Core Byte Media LLC — Print-on-Demand Storefront

A static, front-end-only e-commerce site for **corebytemedia.com**, built with Next.js 16
(App Router), Tailwind CSS v4 and JavaScript. There is no backend: the catalogue is local data,
the cart lives in `localStorage`, and orders are completed client-side with Cash on Delivery.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (43 static routes)
npm run start    # serve the production build
npm run lint
npm run assets   # regenerate the product mockup SVGs
npm run logo     # regenerate the logo derivatives from brand/
```

---

## Read this first

### Branding

The master artwork is `brand/Core Byte Media LLC.png` (1254×1254, transparent). It lives
outside `public/` so the full-resolution original is not shipped to every visitor, and it is
never modified.

`npm run logo` derives everything the site needs from it — all straight crops or placements of
the same pixels, at their original proportions. Nothing is recoloured, restyled, re-typeset or
stretched:

| Generated | Size | Used by |
| --- | --- | --- |
| `public/logo/logo-full.png` | 960×747 | Footer, order confirmation |
| `public/logo/logo-mark.png` | 512×512 | Header, loader, 404 |
| `app/icon.png` | 512×512 | Favicon |
| `app/apple-icon.png` | 180×180 | iOS home screen |
| `app/opengraph-image.png` / `twitter-image.png` | 1200×630 | Social share card |

**Why the header shows the mark, not the full lockup.** The supplied lockup is stacked, and the
wordmark is only 14% of its height — at a 64px header the words "Core Byte Media LLC" would
render about 7px tall and read as a gold smudge. The header uses the hexagon monogram; the full
lockup appears wherever there is room (footer at 104px, order confirmation at 76px, share card).
To use the full lockup in the header instead, change the `<Logo>` call in
[`components/Header.js`](components/Header.js) to `variant="full"` and raise the header height.

**To update the branding:** replace the file in `brand/` and run `npm run logo`. If the canvas
size changes, the script stops and tells you to re-measure the crop boxes in
[`scripts/generate-logo-assets.mjs`](scripts/generate-logo-assets.mjs). Paths are read from
`LOGO` in [`data/site.js`](data/site.js) and nowhere else.

### Placeholder values to replace before launch

| What | Where |
| --- | --- |
| Phone number, email addresses, business hours, location (currently placeholders) | `CONTACT` in `data/site.js` |
| Social media URLs (currently `null` → rendered as inert, not fake links) | `SOCIAL` in `data/site.js` |
| Region, currency, shipping, tax and payment | `STORE_CONFIG` in `data/site.js` — see below |
| Return window and refund timings | `RETURNS` in `data/site.js` |
| Customer testimonials (clearly labelled sample content in the UI) | `data/reviews.js` |
| Product mockup art (generated SVGs, not photography) | `public/products/`, `public/mockups/` |

---

## Regional configuration

The store trades in the **United States, in USD**. That is expressed once, in
`STORE_CONFIG` ([data/site.js](data/site.js)) — `CURRENCY`, `SHIPPING`, `TAX` and `PAYMENT` are
views onto the same object, so re-pointing the business at another market means editing one
block rather than hunting through files.

```js
STORE_CONFIG = {
  country: 'US', countryName: 'United States',
  currency: { code: 'USD', symbol: '$', locale: 'en-US', decimals: 2, filterStep: 5 },
  shipping: { standardRate: 5.95, freeShippingThreshold: 75, estimate: {…} },
  tax:      { enabled: false, rate: 0, label: 'Sales tax' },
  payment:  { cardEnabled: false, codEnabled: true, codOrderLimit: 500, codSurcharge: 0 },
}
```

- **Money is never formatted by hand.** `formatPrice()` in [lib/utils.js](lib/utils.js) wraps
  `Intl.NumberFormat` with the configured locale and currency.
- **Shipping is calculated in one function.** `calculateShipping(subtotal)` in
  [lib/cart.js](lib/cart.js); every component reads its figure from there or from `cartTotals`.
- **US states live in data**, not in the checkout component — [data/us-states.js](data/us-states.js),
  50 states plus DC with two-letter codes.

### Tax

`tax.enabled` is **false**, deliberately. US sales tax is destination-based and varies by state,
county and city, so there is no single rate this storefront could apply honestly. The order
summary says tax is handled at fulfilment rather than showing a number that would be wrong for
most addresses. Setting `enabled: true` with a `rate` makes a tax line appear in the cart,
checkout and order confirmation — the arithmetic is already wired through `calculateTax`.

### Payment

`cardEnabled` is **false** — no gateway is connected. Card is listed first at checkout because
that is what a US shopper expects, but selecting it opens an "Online Card Payment Coming Soon"
notice and can never place an order. There are no card number, expiry or CVV fields anywhere in
this codebase and no payment is ever simulated. Cash on Delivery covers ordering in the meantime
and is itself a flag (`codEnabled`) that can be switched off in one line once card is live.

---

## Project structure

```
brand/                    Master logo artwork (not served — source for `npm run logo`)
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
[scripts/generate-assets.mjs](scripts/generate-assets.mjs), so no image can 404 and no CDN is
required.

**The products are printed with the real logo.** Each mockup embeds a crop of the master
artwork from `brand/`, taken through the same
[scripts/brand-artwork.mjs](scripts/brand-artwork.mjs) used for the site chrome, so product
prints can never drift from the header logo. It is embedded as a data URI rather than linked
because a browser will not fetch external resources from inside an SVG used as an image source.

- **Placement** per product is `PRINT_PLACEMENT` in the generator: the full stacked lockup where
  the panel is big enough for the wordmark to read, the hexagon mark alone where it isn't (caps,
  and the small left-chest placement on a polo). Apparel back views get a small nape print;
  accessories have a clean reverse.
- **Size** — the artwork is quantised to a 128-colour palette (it's a gold gradient on
  transparency, so this is visually identical) and the higher-resolution copy is embedded only in
  the `-detail` views that magnify it. Together those keep `public/products` at ~1.7MB rather
  than ~9MB.
- **The customiser bases stay unbranded** — `printBrand: false` at generation time, with an
  assertion that throws if a logo ever ends up on one, since that surface is for the customer's
  own artwork.

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

**Page metadata goes through one helper.** Next merges the `metadata` export shallowly, so a
page that declares its own `openGraph` object silently drops the share card inherited from the
root. [`lib/seo.js`](lib/seo.js) builds every page's metadata so the OG image, canonical URL and
Twitter card can't be lost by accident.

**No icon or animation dependencies.** The ~30 icons used are inline SVG in
`components/ui/Icons.js`; animations are CSS keyframes registered through Tailwind v4's
`@theme`, with `prefers-reduced-motion` honoured globally in `app/globals.css`.

**Uploaded artwork never leaves the browser.** The customiser reads files with `FileReader` and
keeps them as data URLs. This is stated plainly to the customer in the customiser, the FAQ,
the privacy policy and on the order confirmation, which tells them we will email to collect the
original file.
