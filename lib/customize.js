import { ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from '@/data/customize';
import { formatFileSize } from './utils';

/**
 * Client-side customisation helpers.
 *
 * Nothing here talks to a server. Artwork is read in the browser with FileReader
 * and carried through the cart as a data URL. When a backend exists, the upload
 * step becomes a real POST and `artwork` becomes a returned asset URL — the rest
 * of the shape stays the same.
 */

export const CUSTOMIZER_STORAGE_KEY = 'cbm.customizer.v1';

export const DEFAULT_TRANSFORM = { x: 0, y: 0, scale: 1, rotation: 0 };

/** Validates a selected file before it is read. Returns an error string or null. */
export function validateArtwork(file) {
  if (!file) return 'No file selected.';

  const typeAllowed =
    ACCEPTED_FILE_TYPES.includes(file.type) || /\.(png|jpe?g|svg)$/i.test(file.name);

  if (!typeAllowed) {
    return 'Unsupported file type. Upload a PNG, JPG or SVG.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return `That file is ${formatFileSize(file.size)}. Please keep uploads under ${formatFileSize(
      MAX_FILE_BYTES,
    )}.`;
  }
  return null;
}

/** Reads a file into a data URL usable directly as an <img> src. */
export function readArtwork(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('That file could not be read. Try a different one.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Builds the cart line for a customised product.
 *
 * The key is unique per design so two customisations of the same base garment
 * never merge into one line.
 */
export function buildCustomCartLine({
  base,
  size,
  color,
  quantity,
  artwork,
  fileName,
  transform,
  designId,
}) {
  const colorOption = base.colors.find((option) => option.name === color) || base.colors[0];

  return {
    key: `custom::${base.key}::${designId}`,
    productId: null,
    slug: null,
    name: base.name,
    image: colorOption.image,
    size,
    color: colorOption.name,
    quantity,
    unitPrice: base.basePrice,
    listPrice: null,
    custom: {
      key: `custom::${base.key}::${designId}`,
      baseKey: base.key,
      designId,
      artwork,
      fileName,
      transform,
      printArea: base.printArea,
      // Set to true once a real upload endpoint exists.
      uploaded: false,
    },
  };
}

/** Persists the in-progress design so a refresh does not lose the work. */
export function saveDraft(draft) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(CUSTOMIZER_STORAGE_KEY, JSON.stringify(draft));
    return true;
  } catch {
    // Usually a quota error from a large artwork data URL — the in-memory
    // design still works, it just will not survive a refresh.
    return false;
  }
}

export function readDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CUSTOMIZER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CUSTOMIZER_STORAGE_KEY);
  } catch {
    // Nothing to do — the draft simply stays until storage is available again.
  }
}
