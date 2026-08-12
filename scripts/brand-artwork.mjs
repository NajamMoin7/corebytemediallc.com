/**
 * Shared access to the master brand artwork.
 *
 * Both asset scripts derive from the same file and the same crop boxes, so the
 * logo printed on the product mockups can never drift from the logo used in the
 * site chrome. Nothing here recolours, restyles or stretches the artwork — every
 * output is a straight crop, scaled proportionally.
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT = resolve(__dirname, '..');
export const MASTER = resolve(ROOT, 'brand/Core Byte Media LLC.png');

/** Expected canvas of the master file; the crops below are measured against it. */
export const MASTER_SIZE = { width: 1254, height: 1254 };

/**
 * Content bounds within the master:
 *   full — the complete stacked lockup (hexagon mark over the wordmark)
 *   mark — the hexagon CB monogram on its own
 */
export const CROPS = {
  full: { left: 123, top: 265, width: 1022, height: 677 },
  mark: { left: 392, top: 265, width: 471, height: 539 },
};

/** Fails loudly if the master is replaced with a differently sized file. */
export async function assertMasterUnchanged() {
  const meta = await sharp(MASTER).metadata();
  if (meta.width !== MASTER_SIZE.width || meta.height !== MASTER_SIZE.height) {
    throw new Error(
      `Master artwork is ${meta.width}×${meta.height}, expected ` +
        `${MASTER_SIZE.width}×${MASTER_SIZE.height}. Re-measure CROPS in ` +
        'scripts/brand-artwork.mjs before regenerating.',
    );
  }
  if (!meta.hasAlpha) {
    throw new Error('Master artwork has no alpha channel — it needs a transparent background.');
  }
}

/**
 * Returns a crop as a base64 PNG data URI, resized to `width`.
 *
 * The product mockups are SVG files consumed as image sources, and a browser
 * will not fetch external resources referenced from inside such an SVG — so the
 * logo has to be embedded rather than linked. Since it is embedded in 126 files,
 * size matters: the artwork is a gold gradient on transparency, which quantises
 * to a 128-colour palette with no visible loss and about a tenth of the bytes.
 * The full-quality crops used for the site chrome are generated separately by
 * generate-logo-assets.mjs and are not quantised.
 */
export async function artworkDataUri(crop, width, { colours = 128 } = {}) {
  const buffer = await sharp(MASTER)
    .extract(CROPS[crop])
    .resize({ width })
    .png({ compressionLevel: 9, palette: true, colours, dither: 1 })
    .toBuffer();

  return {
    href: `data:image/png;base64,${buffer.toString('base64')}`,
    width,
    height: Math.round(width * (CROPS[crop].height / CROPS[crop].width)),
    bytes: buffer.length,
  };
}
