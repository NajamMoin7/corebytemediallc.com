/**
 * Flat measurements in inches, taken with the garment laid flat.
 * Chest is measured across the garment one inch below the armhole and doubled.
 */

const APPAREL_GUIDE = {
  note: 'Measured flat, in inches. Allow up to half an inch of variance — these are cut-and-sew garments, not moulded parts.',
  columns: ['Size', 'Chest', 'Length', 'Sleeve'],
  rows: [
    ['XS', '18"', '26"', '7.5"'],
    ['S', '19"', '27"', '8"'],
    ['M', '20.5"', '28"', '8.5"'],
    ['L', '22"', '29"', '9"'],
    ['XL', '23.5"', '30"', '9.5"'],
    ['XXL', '25"', '31"', '10"'],
  ],
};

const OVERSIZED_GUIDE = {
  note: 'Cut deliberately wide with a dropped shoulder. Size down for a standard fit.',
  columns: ['Size', 'Chest', 'Length', 'Shoulder'],
  rows: [
    ['S', '21.5"', '28"', '20"'],
    ['M', '23"', '29"', '21"'],
    ['L', '24.5"', '30"', '22"'],
    ['XL', '26"', '31"', '23"'],
    ['XXL', '27.5"', '32"', '24"'],
  ],
};

const FLEECE_GUIDE = {
  note: 'Fleece garments are cut with more room through the body than tees.',
  columns: ['Size', 'Chest', 'Length', 'Sleeve'],
  rows: [
    ['XS', '19.5"', '25.5"', '23"'],
    ['S', '21"', '26.5"', '23.5"'],
    ['M', '22.5"', '27.5"', '24"'],
    ['L', '24"', '28.5"', '24.5"'],
    ['XL', '25.5"', '29.5"', '25"'],
    ['XXL', '27"', '30.5"', '25.5"'],
  ],
};

const CAP_GUIDE = {
  note: 'One size, adjustable at the back.',
  columns: ['Size', 'Head circumference', 'Brim'],
  rows: [['One Size', '21" – 24" (adjustable)', '2.75"']],
};

const MUG_GUIDE = {
  note: 'Ceramic dimensions, approximate.',
  columns: ['Size', 'Height', 'Diameter', 'Capacity'],
  rows: [
    ['11 oz', '3.75"', '3.25"', '325 ml'],
    ['15 oz', '4.5"', '3.4"', '440 ml'],
  ],
};

const TOTE_GUIDE = {
  note: 'Bag dimensions, approximate.',
  columns: ['Size', 'Width', 'Height', 'Strap drop'],
  rows: [['One Size', '15"', '16"', '11"']],
};

export const SIZE_GUIDES = {
  't-shirts': APPAREL_GUIDE,
  'oversized-t-shirts': OVERSIZED_GUIDE,
  hoodies: FLEECE_GUIDE,
  sweatshirts: FLEECE_GUIDE,
  'polo-shirts': APPAREL_GUIDE,
  caps: CAP_GUIDE,
  mugs: MUG_GUIDE,
  'tote-bags': TOTE_GUIDE,
};

export function getSizeGuide(category) {
  return SIZE_GUIDES[category] || null;
}
