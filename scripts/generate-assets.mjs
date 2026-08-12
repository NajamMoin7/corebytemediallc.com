/**
 * Generates the local product mockup artwork used across the storefront.
 *
 * Everything the site renders for a product lives in `public/products` as a
 * plain SVG, so the site has zero external image dependencies and never shows a
 * broken image. When real product photography becomes available, replace the
 * files in `public/products` (keeping the same filenames) or point the `images`
 * array in `data/products.js` at the new files — no other change is required.
 *
 * The logo printed on each product is the real Core Byte Media LLC artwork,
 * cropped from the master in `brand/` by scripts/brand-artwork.mjs and embedded
 * as a data URI. It has to be embedded rather than linked: a browser will not
 * fetch external resources from inside an SVG that is used as an image source.
 *
 * Run with: npm run assets
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT as root, artworkDataUri, assertMasterUnchanged } from './brand-artwork.mjs';

const outDir = resolve(root, 'public/products');
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 1500;

/**
 * The brand artwork, embedded as a data URI in each generated file.
 * `full` is the stacked lockup; `mark` is the hexagon monogram on its own.
 *
 * Two resolutions of each: the detail view magnifies the print 2.05×, so it
 * needs a larger raster, while every other view would only be paying for pixels
 * it never shows. Embedding the high-resolution copy everywhere cost ~9MB
 * across the 126 branded files; this keeps it near a third of that with no
 * visible difference.
 */
await assertMasterUnchanged();

const ART_SETS = {
  standard: {
    full: await artworkDataUri('full', 340),
    mark: await artworkDataUri('mark', 220),
  },
  detail: {
    full: await artworkDataUri('full', 620),
    mark: await artworkDataUri('mark', 420),
  },
};

/** Set per file by buildGarment before the SVG string is assembled. */
let ART = ART_SETS.standard;

/* ------------------------------------------------------------------ *
 * Colourways
 * ------------------------------------------------------------------ */

const COLORWAYS = {
  black: { base: '#151515', shade: '#080808', light: '#242424', ink: '#e8e2d6' },
  charcoal: { base: '#33383d', shade: '#20242700', light: '#464c52', ink: '#e8e2d6' },
  graphite: { base: '#3b3f44', shade: '#24272a', light: '#50555b', ink: '#e8e2d6' },
  white: { base: '#f2efe9', shade: '#d8d3c9', light: '#fbfaf7', ink: '#1a1a1a' },
  sand: { base: '#d9cdba', shade: '#bcae98', light: '#e8dfd0', ink: '#1a1a1a' },
  navy: { base: '#1e2735', shade: '#141a24', light: '#2c3849', ink: '#e8e2d6' },
  olive: { base: '#414736', shade: '#2c3125', light: '#545b46', ink: '#e8e2d6' },
  bone: { base: '#e6e0d4', shade: '#c9c1b1', light: '#f3efe7', ink: '#1a1a1a' },
};

// Normalise the accidental 8-digit value above.
COLORWAYS.charcoal.shade = '#202427';

const GOLD = '#c9a227';
const GOLD_LIGHT = '#e8cf85';

/* ------------------------------------------------------------------ *
 * Garment geometry
 * ------------------------------------------------------------------ */

function teeBody({ shoulder = 200, hem = 195, length = 1180, sleeve = 250 } = {}) {
  const cx = W / 2;
  const neck = 105;
  const shoulderY = 372;
  const sleeveY = 640;
  return [
    `M ${cx - neck} ${shoulderY - 26}`,
    `C ${cx - 55} ${shoulderY + 52} ${cx + 55} ${shoulderY + 52} ${cx + neck} ${shoulderY - 26}`,
    `L ${cx + shoulder} ${shoulderY - 40}`,
    `C ${cx + shoulder + sleeve * 0.45} ${shoulderY + 22} ${cx + shoulder + sleeve * 0.78} ${sleeveY - 130} ${cx + shoulder + sleeve} ${sleeveY - 12}`,
    `L ${cx + shoulder + sleeve - 92} ${sleeveY + 96}`,
    `C ${cx + shoulder + 26} ${sleeveY + 30} ${cx + hem + 34} ${sleeveY - 24} ${cx + hem} ${sleeveY + 30}`,
    `L ${cx + hem} ${length}`,
    `C ${cx + 60} ${length + 34} ${cx - 60} ${length + 34} ${cx - hem} ${length}`,
    `L ${cx - hem} ${sleeveY + 30}`,
    `C ${cx - hem - 34} ${sleeveY - 24} ${cx - shoulder - 26} ${sleeveY + 30} ${cx - shoulder - sleeve + 92} ${sleeveY + 96}`,
    `L ${cx - shoulder - sleeve} ${sleeveY - 12}`,
    `C ${cx - shoulder - sleeve * 0.78} ${sleeveY - 130} ${cx - shoulder - sleeve * 0.45} ${shoulderY + 22} ${cx - shoulder} ${shoulderY - 40}`,
    'Z',
  ].join(' ');
}

function hoodieBody({ pocket = true } = {}) {
  const cx = W / 2;
  const shoulder = 235;
  const sleeve = 255;
  const shoulderY = 420;
  const sleeveY = 700;
  const length = 1210;
  return [
    `M ${cx - 130} ${shoulderY - 20}`,
    `C ${cx - 60} ${shoulderY + 60} ${cx + 60} ${shoulderY + 60} ${cx + 130} ${shoulderY - 20}`,
    `L ${cx + shoulder} ${shoulderY - 34}`,
    `C ${cx + shoulder + sleeve * 0.45} ${shoulderY + 30} ${cx + shoulder + sleeve * 0.8} ${sleeveY - 140} ${cx + shoulder + sleeve} ${sleeveY - 10}`,
    `L ${cx + shoulder + sleeve - 96} ${sleeveY + 120}`,
    `C ${cx + shoulder + 20} ${sleeveY + 40} ${cx + 230} ${sleeveY - 20} ${cx + 222} ${sleeveY + 40}`,
    `L ${cx + 222} ${length}`,
    `C ${cx + 70} ${length + 30} ${cx - 70} ${length + 30} ${cx - 222} ${length}`,
    `L ${cx - 222} ${sleeveY + 40}`,
    `C ${cx - 230} ${sleeveY - 20} ${cx - shoulder - 20} ${sleeveY + 40} ${cx - shoulder - sleeve + 96} ${sleeveY + 120}`,
    `L ${cx - shoulder - sleeve} ${sleeveY - 10}`,
    `C ${cx - shoulder - sleeve * 0.8} ${sleeveY - 140} ${cx - shoulder - sleeve * 0.45} ${shoulderY + 30} ${cx - shoulder} ${shoulderY - 34}`,
    'Z',
  ].join(' ');
}

const HOOD_PATH = (() => {
  const cx = W / 2;
  return [
    `M ${cx - 132} ${420}`,
    `C ${cx - 210} ${390} ${cx - 214} ${268} ${cx - 122} ${232}`,
    `C ${cx - 56} ${206} ${cx + 56} ${206} ${cx + 122} ${232}`,
    `C ${cx + 214} ${268} ${cx + 210} ${390} ${cx + 132} ${420}`,
    `C ${cx + 60} ${478} ${cx - 60} ${478} ${cx - 132} ${420}`,
    'Z',
  ].join(' ');
})();

function capShape() {
  const cx = W / 2;
  return {
    crown: `M ${cx - 250} ${820} C ${cx - 250} ${560} ${cx - 140} ${470} ${cx} ${470} C ${cx + 140} ${470} ${cx + 250} ${560} ${cx + 250} ${820} Z`,
    brim: `M ${cx - 262} ${812} C ${cx - 150} ${790} ${cx + 210} ${790} ${cx + 430} ${880} C ${cx + 300} ${960} ${cx - 160} ${930} ${cx - 262} ${872} Z`,
  };
}

function mugShape() {
  const cx = W / 2;
  return {
    body: `M ${cx - 210} ${470} L ${cx + 190} ${470} C ${cx + 208} ${470} ${cx + 214} ${486} ${cx + 212} ${508} L ${cx + 188} ${1010} C ${cx + 184} ${1058} ${cx + 160} ${1076} ${cx + 118} ${1076} L ${cx - 138} ${1076} C ${cx - 180} ${1076} ${cx - 204} ${1058} ${cx - 208} ${1010} L ${cx - 232} ${508} C ${cx - 234} ${486} ${cx - 228} ${470} ${cx - 210} ${470} Z`,
    handle: `M ${cx + 200} ${576} C ${cx + 330} ${560} ${cx + 396} ${640} ${cx + 392} ${748} C ${cx + 388} ${856} ${cx + 320} ${918} ${cx + 194} ${906} L ${cx + 196} ${842} C ${cx + 286} ${848} ${cx + 326} ${812} ${cx + 328} ${744} C ${cx + 330} ${676} ${cx + 292} ${632} ${cx + 202} ${640} Z`,
    rim: `M ${cx - 212} ${470} L ${cx + 192} ${470} C ${cx + 210} ${470} ${cx + 216} ${486} ${cx + 214} ${506} C ${cx + 150} ${534} ${cx - 172} ${534} ${cx - 234} ${506} C ${cx - 236} ${486} ${cx - 230} ${470} ${cx - 212} ${470} Z`,
  };
}

function toteShape() {
  const cx = W / 2;
  return {
    body: `M ${cx - 275} ${520} L ${cx + 275} ${520} C ${cx + 292} ${520} ${cx + 300} ${534} ${cx + 298} ${556} L ${cx + 268} ${1160} C ${cx + 266} ${1186} ${cx + 252} ${1196} ${cx + 228} ${1196} L ${cx - 228} ${1196} C ${cx - 252} ${1196} ${cx - 266} ${1186} ${cx - 268} ${1160} L ${cx - 298} ${556} C ${cx - 300} ${534} ${cx - 292} ${520} ${cx - 275} ${520} Z`,
    strapL: `M ${cx - 190} ${528} C ${cx - 196} ${360} ${cx - 96} ${296} ${cx - 40} ${300} L ${cx - 40} ${358} C ${cx - 84} ${356} ${cx - 140} ${400} ${cx - 134} ${528} Z`,
    strapR: `M ${cx + 190} ${528} C ${cx + 196} ${360} ${cx + 96} ${296} ${cx + 40} ${300} L ${cx + 40} ${358} C ${cx + 84} ${356} ${cx + 140} ${400} ${cx + 134} ${528} Z`,
  };
}

/* ------------------------------------------------------------------ *
 * SVG assembly
 * ------------------------------------------------------------------ */

/**
 * Print placement per product, in canvas units.
 *
 * `art` picks which crop of the master logo is printed: the full stacked lockup
 * where the panel is large enough for the wordmark to read, the hexagon mark
 * alone where it is not (caps, and the small left-chest placement on a polo).
 */
const PRINT_PLACEMENT = {
  tee: { art: 'full', width: 350, cx: W / 2, cy: 640 },
  oversized: { art: 'full', width: 380, cx: W / 2, cy: 650 },
  sweatshirt: { art: 'full', width: 350, cx: W / 2, cy: 640 },
  hoodie: { art: 'full', width: 290, cx: W / 2, cy: 655 },
  polo: { art: 'mark', width: 86, cx: W / 2 - 120, cy: 590 },
  cap: { art: 'mark', width: 104, cx: W / 2, cy: 655 },
  mug: { art: 'full', width: 290, cx: W / 2 - 10, cy: 760 },
  tote: { art: 'full', width: 330, cx: W / 2, cy: 840 },
};

/** Small nape/back-neck print used on the reverse of apparel. */
const BACK_PLACEMENT = {
  tee: { width: 74, cy: 430 },
  oversized: { width: 74, cy: 440 },
  sweatshirt: { width: 74, cy: 428 },
  hoodie: { width: 78, cy: 560 },
  polo: { width: 70, cy: 428 },
};

/**
 * Places the embedded logo. `ART` holds one copy of each crop as a data URI,
 * declared once per file in <defs> and referenced with <use>, so printing the
 * logo twice does not double the file size.
 */
function brandPrint({ art, width, cx, cy, id, opacity = 1 }) {
  const source = ART[art];
  const scale = width / source.width;
  const height = source.height * scale;
  return `
    <use href="#brand-${art}-${id}"
         transform="translate(${(cx - width / 2).toFixed(1)} ${(cy - height / 2).toFixed(1)}) scale(${scale.toFixed(4)})"
         opacity="${opacity}"/>`;
}

/** Declares the logo crops this file actually uses. */
function artDefs(id, arts) {
  return arts
    .map((art) => {
      const source = ART[art];
      return `<image id="brand-${art}-${id}" href="${source.href}" width="${source.width}" height="${source.height}" preserveAspectRatio="xMidYMid meet"/>`;
    })
    .join('\n    ');
}

function defs(cw, id, arts = []) {
  return `
  <defs>
    ${artDefs(id, arts)}
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#101215"/>
      <stop offset="55%" stop-color="#0a0b0d"/>
      <stop offset="100%" stop-color="#050506"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.5" cy="0.36" r="0.62">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.16"/>
      <stop offset="60%" stop-color="${GOLD}" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fab-${id}" x1="0.12" y1="0" x2="0.88" y2="1">
      <stop offset="0%" stop-color="${cw.light}"/>
      <stop offset="42%" stop-color="${cw.base}"/>
      <stop offset="100%" stop-color="${cw.shade}"/>
    </linearGradient>
    <linearGradient id="fold-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#000" stop-opacity="0.30"/>
      <stop offset="22%" stop-color="#000" stop-opacity="0"/>
      <stop offset="78%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.34"/>
    </linearGradient>
    <linearGradient id="gold-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GOLD_LIGHT}"/>
      <stop offset="50%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="#8f7218"/>
    </linearGradient>
  </defs>`;
}

function frame(id, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  ${inner}
</svg>`;
}

function backdrop(id) {
  return `
  <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#glow-${id})"/>
  <ellipse cx="${W / 2}" cy="${H - 150}" rx="380" ry="52" fill="#000" opacity="0.5"/>`;
}

/**
 * Builds one garment SVG.
 * view: 'front' | 'back' | 'detail' | 'angle'
 */
function buildGarment({ type, colorway, view, id, printBrand = true }) {
  const cw = COLORWAYS[colorway];
  const cx = W / 2;
  let body = '';

  // The detail view magnifies the print, so it embeds the larger raster.
  ART = view === 'detail' ? ART_SETS.detail : ART_SETS.standard;

  const shading = (path) => `
    <path d="${path}" fill="url(#fab-${id})"/>
    <path d="${path}" fill="url(#fold-${id})"/>
    <path d="${path}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="3"/>`;

  if (type === 'tee' || type === 'oversized' || type === 'polo' || type === 'sweatshirt') {
    const geo =
      type === 'oversized'
        ? { shoulder: 232, hem: 232, length: 1240, sleeve: 268 }
        : type === 'sweatshirt'
          ? { shoulder: 215, hem: 205, length: 1160, sleeve: 262 }
          : { shoulder: 200, hem: 195, length: 1180, sleeve: 250 };
    const path = teeBody(geo);
    const collarY = 346;
    body = `
      ${shading(path)}
      <path d="M ${cx - 108} ${collarY} C ${cx - 56} ${collarY + 84} ${cx + 56} ${collarY + 84} ${cx + 108} ${collarY}
               C ${cx + 56} ${collarY + 42} ${cx - 56} ${collarY + 42} ${cx - 108} ${collarY} Z"
            fill="${cw.shade}" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>`;

    if (type === 'polo') {
      body += `
        <path d="M ${cx - 96} ${collarY + 6} L ${cx - 26} ${collarY + 96} L ${cx} ${collarY + 62} L ${cx + 26} ${collarY + 96} L ${cx + 96} ${collarY + 6}
                 C ${cx + 50} ${collarY + 46} ${cx - 50} ${collarY + 46} ${cx - 96} ${collarY + 6} Z"
              fill="${cw.light}" stroke="#000" stroke-opacity="0.2" stroke-width="2"/>
        <rect x="${cx - 9}" y="${collarY + 66}" width="18" height="150" rx="6" fill="${cw.shade}" opacity="0.85"/>
        <circle cx="${cx}" cy="${collarY + 106}" r="7" fill="${GOLD}" opacity="0.9"/>
        <circle cx="${cx}" cy="${collarY + 176}" r="7" fill="${GOLD}" opacity="0.9"/>`;
    }
    if (type === 'sweatshirt') {
      body += `
        <rect x="${cx - geo.hem}" y="${geo.length - 62}" width="${geo.hem * 2}" height="62" fill="${cw.shade}" opacity="0.75"/>
        <path d="M ${cx - geo.hem} ${geo.length - 62} h ${geo.hem * 2}" stroke="#000" stroke-opacity="0.25" stroke-width="3"/>`;
    }
  } else if (type === 'hoodie') {
    const path = hoodieBody();
    body = `
      ${shading(path)}
      <path d="${HOOD_PATH}" fill="${cw.light}" stroke="#000" stroke-opacity="0.3" stroke-width="3"/>
      <path d="${HOOD_PATH}" fill="url(#fold-${id})" opacity="0.6"/>
      <path d="M ${cx - 128} ${418} C ${cx - 60} ${470} ${cx + 60} ${470} ${cx + 128} ${418}"
            fill="none" stroke="#000" stroke-opacity="0.45" stroke-width="5"/>
      <circle cx="${cx - 52}" cy="${452}" r="9" fill="${GOLD}"/>
      <circle cx="${cx + 52}" cy="${452}" r="9" fill="${GOLD}"/>
      <path d="M ${cx - 52} ${460} C ${cx - 62} ${560} ${cx - 44} ${640} ${cx - 58} ${716}" stroke="${cw.shade}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M ${cx + 52} ${460} C ${cx + 62} ${556} ${cx + 40} ${628} ${cx + 54} ${700}" stroke="${cw.shade}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M ${cx - 190} ${900} L ${cx + 190} ${900} L ${cx + 172} ${1076} L ${cx - 172} ${1076} Z"
            fill="${cw.shade}" opacity="0.5" stroke="#000" stroke-opacity="0.25" stroke-width="3"/>
      <rect x="${cx - 222}" y="1148" width="444" height="62" fill="${cw.shade}" opacity="0.7"/>`;
  } else if (type === 'cap') {
    const { crown, brim } = capShape();
    body = `
      <path d="${brim}" fill="${cw.shade}" stroke="#000" stroke-opacity="0.35" stroke-width="3"/>
      ${shading(crown)}
      <path d="M ${cx} 470 L ${cx} 820" stroke="#000" stroke-opacity="0.22" stroke-width="3"/>
      <path d="M ${cx - 128} 486 C ${cx - 96} 640 ${cx - 90} 740 ${cx - 92} 820" stroke="#000" stroke-opacity="0.16" stroke-width="3" fill="none"/>
      <path d="M ${cx + 128} 486 C ${cx + 96} 640 ${cx + 90} 740 ${cx + 92} 820" stroke="#000" stroke-opacity="0.16" stroke-width="3" fill="none"/>
      <circle cx="${cx}" cy="482" r="14" fill="${cw.light}" stroke="#000" stroke-opacity="0.3" stroke-width="2"/>`;
  } else if (type === 'mug') {
    const { body: mb, handle, rim } = mugShape();
    body = `
      <path d="${handle}" fill="${cw.light}" stroke="#000" stroke-opacity="0.3" stroke-width="3"/>
      ${shading(mb)}
      <path d="${rim}" fill="${cw.light}" stroke="#000" stroke-opacity="0.28" stroke-width="3"/>
      <ellipse cx="${cx - 10}" cy="500" rx="196" ry="26" fill="#0b0b0c" opacity="0.55"/>`;
  } else if (type === 'tote') {
    const { body: tb, strapL, strapR } = toteShape();
    body = `
      <path d="${strapL}" fill="${cw.shade}" stroke="#000" stroke-opacity="0.3" stroke-width="3"/>
      <path d="${strapR}" fill="${cw.shade}" stroke="#000" stroke-opacity="0.3" stroke-width="3"/>
      ${shading(tb)}
      <path d="M ${cx - 292} 560 L ${cx + 292} 560" stroke="#000" stroke-opacity="0.2" stroke-width="3"/>`;
  }

  /*
   * The printed logo. Front, detail and angle views show the main placement;
   * the back view of apparel shows the small nape print instead. Accessories
   * have a clean reverse, so they get nothing on the back.
   */
  const placement = PRINT_PLACEMENT[type];
  const back = BACK_PLACEMENT[type];

  let print = '';
  let usedArt = [];

  if (printBrand) {
    if (view === 'back') {
      if (back) {
        print = brandPrint({
          art: 'mark',
          width: back.width,
          cx,
          cy: back.cy,
          id,
          opacity: 0.9,
        });
        usedArt = ['mark'];
      }
    } else {
      print = brandPrint({ ...placement, id });
      usedArt = [placement.art];
    }
  }

  // The detail view zooms on whatever is actually printed in this view.
  const focusY = view === 'back' && back ? back.cy : placement.cy;
  const head = `${defs(cw, id, usedArt)}${backdrop(id)}`;

  let content = `${head}<g>${body}${print}</g>`;

  if (view === 'detail') {
    content = `${head}
      <g transform="translate(${cx} ${H / 2}) scale(2.05) translate(${-cx} ${-focusY - 10})">${body}${print}</g>`;
  } else if (view === 'angle') {
    content = `${head}
      <g transform="translate(${cx} ${H / 2}) rotate(-7) scale(0.92) translate(${-cx} ${-H / 2})">${body}${print}</g>`;
  }

  return frame(id, content);
}

/* ------------------------------------------------------------------ *
 * Output map — every file the product data references
 * ------------------------------------------------------------------ */

const PRODUCT_ART = [
  { slug: 'classic-core-tee', type: 'tee', colors: ['black', 'white', 'sand'] },
  { slug: 'premium-oversized-tee', type: 'oversized', colors: ['black', 'bone', 'olive'] },
  { slug: 'signature-gold-hoodie', type: 'hoodie', colors: ['black', 'charcoal'] },
  { slug: 'core-byte-essential-hoodie', type: 'hoodie', colors: ['graphite', 'navy', 'black'] },
  { slug: 'minimal-logo-mug', type: 'mug', colors: ['white', 'black'] },
  { slug: 'heritage-crew-sweatshirt', type: 'sweatshirt', colors: ['charcoal', 'sand', 'black'] },
  { slug: 'monogram-polo-shirt', type: 'polo', colors: ['navy', 'white', 'black'] },
  { slug: 'structured-gold-cap', type: 'cap', colors: ['black', 'sand'] },
  { slug: 'everyday-canvas-tote', type: 'tote', colors: ['bone', 'black'] },
  { slug: 'midnight-oversized-tee', type: 'oversized', colors: ['black', 'navy'] },
  { slug: 'atelier-heavy-tee', type: 'tee', colors: ['bone', 'olive', 'black'] },
  { slug: 'champagne-accent-hoodie', type: 'hoodie', colors: ['sand', 'charcoal'] },
  { slug: 'studio-fleece-sweatshirt', type: 'sweatshirt', colors: ['graphite', 'bone'] },
  { slug: 'executive-pique-polo', type: 'polo', colors: ['black', 'charcoal'] },
  { slug: 'low-profile-dad-cap', type: 'cap', colors: ['navy', 'olive'] },
  { slug: 'ceramic-matte-black-mug', type: 'mug', colors: ['black', 'charcoal'] },
  { slug: 'gilded-rim-mug', type: 'mug', colors: ['white', 'bone'] },
  { slug: 'market-canvas-tote', type: 'tote', colors: ['sand', 'olive'] },
  { slug: 'core-tech-longline-tee', type: 'oversized', colors: ['charcoal', 'white'] },
  { slug: 'signature-crew-sweatshirt', type: 'sweatshirt', colors: ['black', 'navy'] },
  { slug: 'weekend-relaxed-tee', type: 'tee', colors: ['navy', 'sand'] },
  { slug: 'noir-zip-hoodie', type: 'hoodie', colors: ['black', 'graphite'] },
  { slug: 'artisan-print-tote', type: 'tote', colors: ['black', 'bone'] },
  { slug: 'summit-structured-cap', type: 'cap', colors: ['charcoal', 'white'] },
];

// Blank mockup bases used by the /customize preview.
const CUSTOMIZE_BASES = [
  { key: 'tshirt', type: 'tee', colors: ['black', 'white', 'sand', 'navy', 'olive', 'charcoal'] },
  { key: 'hoodie', type: 'hoodie', colors: ['black', 'white', 'sand', 'navy', 'olive', 'charcoal'] },
  { key: 'sweatshirt', type: 'sweatshirt', colors: ['black', 'white', 'sand', 'navy', 'olive', 'charcoal'] },
  { key: 'mug', type: 'mug', colors: ['white', 'black'] },
  { key: 'cap', type: 'cap', colors: ['black', 'white', 'sand', 'navy', 'olive', 'charcoal'] },
  { key: 'tote', type: 'tote', colors: ['bone', 'black', 'sand', 'olive'] },
];

const VIEWS = ['front', 'back', 'detail', 'angle'];

let count = 0;
for (const item of PRODUCT_ART) {
  const primary = item.colors[0];
  for (const view of VIEWS) {
    const id = `${item.slug}-${view}`;
    writeFileSync(
      resolve(outDir, `${item.slug}-${view}.svg`),
      buildGarment({ type: item.type, colorway: primary, view, id }),
    );
    count += 1;
  }
  // One front-view file per additional colourway so colour swatches change the image.
  for (const color of item.colors.slice(1)) {
    const id = `${item.slug}-${color}`;
    writeFileSync(
      resolve(outDir, `${item.slug}-${color}.svg`),
      buildGarment({ type: item.type, colorway: color, view: 'front', id }),
    );
    count += 1;
  }
}

/*
 * Blank customiser bases. These must stay unbranded — the customer's own
 * artwork goes on that surface — so the logo is switched off at generation
 * rather than stripped out of the finished file afterwards.
 */
const blankOutDir = resolve(root, 'public/mockups');
mkdirSync(blankOutDir, { recursive: true });
let blanks = 0;
for (const base of CUSTOMIZE_BASES) {
  for (const color of base.colors) {
    const id = `mock-${base.key}-${color}`;
    const svg = buildGarment({
      type: base.type,
      colorway: color,
      view: 'front',
      id,
      printBrand: false,
    });

    if (svg.includes('data:image/png;base64')) {
      throw new Error(`Customiser base ${base.key}-${color} was generated with branding on it.`);
    }

    writeFileSync(resolve(blankOutDir, `${base.key}-${color}.svg`), svg);
    blanks += 1;
    count += 1;
  }
}

// Category tiles reuse the product art, so nothing further to generate.
const branded = count - blanks;
console.log(`Generated ${count} SVG assets:`);
console.log(`  ${branded} product mockups printed with the Core Byte Media LLC logo`);
console.log(`  ${blanks} blank customiser bases (deliberately unbranded)`);
console.log(
  `  embedded artwork: standard ${Math.round(ART_SETS.standard.full.bytes / 1024)}KB / ` +
    `detail ${Math.round(ART_SETS.detail.full.bytes / 1024)}KB per file`,
);
