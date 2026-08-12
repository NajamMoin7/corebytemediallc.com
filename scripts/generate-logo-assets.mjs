/**
 * Derives the logo assets the site needs from the supplied master artwork.
 *
 * The master file lives in `brand/` — inside the repo as the source of truth,
 * but outside `public/` so the full-resolution original is not shipped to every
 * visitor. Everything generated here is a straight crop or placement of those
 * same pixels: nothing is recoloured, restyled, re-typeset or stretched, and
 * aspect ratios are preserved exactly.
 *
 * To update the branding, replace the file in `brand/` and re-run this script.
 * If the canvas size changes it will refuse to run until the crop boxes below
 * are re-measured.
 *
 * Generated:
 *   public/logo/core-byte-media-logo.png   full lockup, transparent padding trimmed
 *   public/logo/core-byte-media-mark.png   hexagon CB mark only, for tight spaces
 *   app/icon.png                           favicon tile (mark on the brand black)
 *   app/apple-icon.png                     iOS home-screen tile
 *   app/opengraph-image.png                social share card
 *   app/twitter-image.png                  same card for Twitter/X
 *
 * Run with: npm run logo
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SOURCE = resolve(root, 'brand/Core Byte Media LLC.png');
const LOGO_DIR = resolve(root, 'public/logo');
const APP_DIR = resolve(root, 'app');

const INK = '#0a0b0d';

/**
 * Measured from the master file. The artwork sits on a 1254×1254 canvas with a
 * lot of transparent margin; these are the real content bounds.
 *   full lockup : x 123–1144, y 265–941
 *   hexagon mark: x 392–862,  y 265–803
 *   wordmark    : x 123–1144, y 845–941
 */
const CROPS = {
  full: { left: 123, top: 265, width: 1022, height: 677 },
  mark: { left: 392, top: 265, width: 471, height: 539 },
};

mkdirSync(LOGO_DIR, { recursive: true });

/** Verifies the measured crops still match the master before writing anything. */
async function assertSourceUnchanged() {
  const meta = await sharp(SOURCE).metadata();
  if (meta.width !== 1254 || meta.height !== 1254) {
    throw new Error(
      `Master artwork is ${meta.width}×${meta.height}, expected 1254×1254. ` +
        'Re-measure the crop boxes in this script before regenerating.',
    );
  }
  if (!meta.hasAlpha) {
    throw new Error('Master artwork has no alpha channel — it needs a transparent background.');
  }
}

/** Rounded-square tile with the mark centred, used for the app icons. */
async function tile(size, radius) {
  const inset = Math.round(size * 0.19);
  const markSize = size - inset * 2;
  const markHeight = markSize;
  const markWidth = Math.round(markHeight * (CROPS.mark.width / CROPS.mark.height));

  const mark = await sharp(SOURCE)
    .extract(CROPS.mark)
    .resize(markWidth, markHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${radius}" fill="${INK}"/>
     </svg>`,
  );

  return sharp(background)
    .composite([
      {
        input: mark,
        left: Math.round((size - markWidth) / 2),
        top: Math.round((size - markHeight) / 2),
      },
    ])
    .png()
    .toBuffer();
}

/** 1200×630 share card: the full lockup on the brand black with a gold wash. */
async function shareCard() {
  const width = 1200;
  const height = 630;

  const lockupWidth = 620;
  const lockupHeight = Math.round(lockupWidth * (CROPS.full.height / CROPS.full.width));

  const lockup = await sharp(SOURCE)
    .extract(CROPS.full)
    .resize(lockupWidth, lockupHeight)
    .png()
    .toBuffer();

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
       <defs>
         <radialGradient id="glow" cx="50%" cy="42%" r="62%">
           <stop offset="0%" stop-color="#c9a227" stop-opacity="0.20"/>
           <stop offset="60%" stop-color="#c9a227" stop-opacity="0.045"/>
           <stop offset="100%" stop-color="#c9a227" stop-opacity="0"/>
         </radialGradient>
         <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0%" stop-color="#c9a227" stop-opacity="0"/>
           <stop offset="50%" stop-color="#c9a227" stop-opacity="0.9"/>
           <stop offset="100%" stop-color="#c9a227" stop-opacity="0"/>
         </linearGradient>
       </defs>
       <rect width="${width}" height="${height}" fill="${INK}"/>
       <rect width="${width}" height="${height}" fill="url(#glow)"/>
       <rect x="0" y="0" width="${width}" height="3" fill="url(#rule)"/>
       <rect x="0" y="${height - 3}" width="${width}" height="3" fill="url(#rule)"/>
     </svg>`,
  );

  return sharp(background)
    .composite([
      {
        input: lockup,
        left: Math.round((width - lockupWidth) / 2),
        top: Math.round((height - lockupHeight) / 2),
      },
    ])
    .png()
    .toBuffer();
}

await assertSourceUnchanged();

// Full lockup, padding trimmed. Same pixels, no margin.
await sharp(SOURCE)
  .extract(CROPS.full)
  .png({ compressionLevel: 9 })
  .toFile(resolve(LOGO_DIR, 'core-byte-media-logo.png'));

// Hexagon mark on its own, for the header, loader and icons.
await sharp(SOURCE)
  .extract(CROPS.mark)
  .png({ compressionLevel: 9 })
  .toFile(resolve(LOGO_DIR, 'core-byte-media-mark.png'));

writeFileSync(resolve(APP_DIR, 'icon.png'), await tile(512, 104));
writeFileSync(resolve(APP_DIR, 'apple-icon.png'), await tile(180, 0));

const card = await shareCard();
writeFileSync(resolve(APP_DIR, 'opengraph-image.png'), card);
writeFileSync(resolve(APP_DIR, 'twitter-image.png'), card);

console.log('Logo assets generated:');
console.log('  public/logo/core-byte-media-logo.png  1022×677  (full lockup, trimmed)');
console.log('  public/logo/core-byte-media-mark.png   471×539  (hexagon mark)');
console.log('  app/icon.png                           512×512');
console.log('  app/apple-icon.png                     180×180');
console.log('  app/opengraph-image.png               1200×630');
console.log('  app/twitter-image.png                 1200×630');
