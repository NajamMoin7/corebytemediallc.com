import { SHIPPING, RETURNS, CONTACT } from './site';

export const FAQ_GROUPS = [
  {
    id: 'ordering',
    title: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Choose a product, select your size and colour, and add it to your cart. When you are ready, open the cart and continue to checkout. Fill in your delivery details, select Cash on Delivery, and confirm. You will see an order number on the confirmation screen — keep it for reference.',
      },
      {
        q: 'Do I need an account to order?',
        a: 'No. Checkout works without registration. Your cart is stored in your own browser, so it will still be there if you close the tab and come back on the same device.',
      },
      {
        q: 'Can I change or cancel an order after placing it?',
        a: `Contact us as soon as possible at ${CONTACT.email} with your order number. Standard catalogue items can usually be changed or cancelled before they are dispatched. Customised items move into production quickly, so once printing has started the order can no longer be changed.`,
      },
      {
        q: 'Is there a minimum order quantity?',
        a: 'No minimum. A single item is a perfectly normal order. For larger runs, get in touch and we will quote you directly.',
      },
    ],
  },
  {
    id: 'customisation',
    title: 'Customisation',
    items: [
      {
        q: 'What file types can I upload?',
        a: 'PNG, JPG and JPEG are supported everywhere. SVG is supported in most browsers. For the best result upload a PNG with a transparent background at roughly 2000 pixels on the longest edge.',
      },
      {
        q: 'What happens to my uploaded design?',
        a: 'On this website the preview runs entirely in your own browser — your file is read locally and never leaves your device. Nothing is uploaded to a server. Because of that, the actual artwork file has to be sent to us separately after ordering so we can print it; we will email you to collect it.',
      },
      {
        q: 'Do I need to own the design I upload?',
        a: 'Yes. You are responsible for holding the rights or permission to reproduce any logo, artwork, photograph or trademark you send us. We may decline to print anything we believe infringes someone else\'s rights. See our Terms & Conditions for the full position.',
      },
      {
        q: 'Will the printed result look exactly like the preview?',
        a: 'The preview is an approximation of placement and scale, not an exact colour proof. Screen colours differ from printed ink, and fabric texture affects how a print reads. Placement will match what you set; expect minor colour variation.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: `Orders are prepared in ${SHIPPING.estimate.processingDays}. After dispatch, allow ${SHIPPING.estimate.majorCities} for major cities and ${SHIPPING.estimate.otherAreas} for other areas within Pakistan.`,
      },
      {
        q: 'How much is shipping?',
        a: `Shipping is a flat Rs ${SHIPPING.flatRate.toLocaleString('en-PK')} per order, and free on orders over Rs ${SHIPPING.freeThreshold.toLocaleString('en-PK')}. These are example rates configured in one place and can be adjusted at any time.`,
      },
      {
        q: 'Do you deliver outside Pakistan?',
        a: 'Cash on Delivery is available within Pakistan only. For international orders, contact us before ordering so we can confirm whether we can serve your location and what the cost would be.',
      },
      {
        q: 'What if I am not available when the courier arrives?',
        a: 'The courier will normally attempt delivery again and call the number on the order. If they cannot reach you across the attempts allowed by the courier, the parcel is returned to us and we will contact you to arrange another dispatch.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    items: [
      {
        q: 'What payment methods can I use?',
        a: 'Cash on Delivery is the only method currently available. You pay the courier in cash when the parcel is handed to you.',
      },
      {
        q: 'Can I pay by debit or credit card?',
        a: 'Not yet. Card payment is shown at checkout because we are preparing for it, but it is disabled and no card details are collected or stored. Selecting it will tell you to use Cash on Delivery instead.',
      },
      {
        q: 'Is there an extra charge for Cash on Delivery?',
        a:
          SHIPPING.codSurcharge > 0
            ? `Yes — a Cash on Delivery handling charge of Rs ${SHIPPING.codSurcharge} applies.`
            : 'No. There is no additional handling charge for paying on delivery.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return window?',
        a: `${RETURNS.windowDays} days from delivery for unused catalogue items in their original condition and packaging.`,
      },
      {
        q: 'Can I return a customised product?',
        a: 'Customised items are made to your specification, so they cannot be returned for a change of mind or an incorrect size choice. They are of course covered if the item arrives damaged, defective, or is not what you ordered.',
      },
      {
        q: 'My item arrived damaged. What do I do?',
        a: `Email ${CONTACT.supportEmail} within 48 hours of delivery with your order number and clear photographs of the item and its packaging. We will arrange a replacement or a refund.`,
      },
      {
        q: 'How long do refunds take?',
        a: `Once the returned item is received and inspected (about ${RETURNS.inspectionDays} business days), approved refunds are issued within ${RETURNS.refundDays}.`,
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & Sizing',
    items: [
      {
        q: 'How do I choose the right size?',
        a: 'Every product page has a size guide with flat measurements. Measure a garment you already own and compare — it is more reliable than body measurements. If you are between sizes on a fitted style, size up.',
      },
      {
        q: 'Are the colours on screen accurate?',
        a: 'They are close, but every screen is calibrated differently and fabric absorbs light in ways a screen cannot show. Treat the colour names as the reference rather than the exact pixel colour.',
      },
      {
        q: 'How should I wash printed garments?',
        a: 'Wash cold and inside out, and avoid ironing directly over the print. Every product page lists specific care instructions for that fabric.',
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((group) => group.items);
