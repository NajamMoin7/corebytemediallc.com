import { SHIPPING, RETURNS, CONTACT, PAYMENT, TAX } from './site';
import { formatPrice } from '@/lib/utils';

export const FAQ_GROUPS = [
  {
    id: 'ordering',
    title: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Choose a product, select your size and colour, and add it to your cart. When you are ready, open the cart and continue to checkout. Fill in your delivery details, pay by card or choose Cash on Delivery, and confirm. You will see an order number on the confirmation screen — keep it for reference.',
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
        a: `Every item is made to order, so there are two stages. Production takes ${SHIPPING.estimate.processingDays}, then standard shipping is typically ${SHIPPING.estimate.standard} to addresses in the contiguous United States. Alaska, Hawaii and other non-contiguous addresses usually take ${SHIPPING.estimate.remote}.`,
      },
      {
        q: 'How much is shipping?',
        a: `Standard shipping is a flat ${formatPrice(SHIPPING.standardRate)} per order, and free on orders over ${formatPrice(SHIPPING.freeShippingThreshold)}. These are example rates held in one configuration file and can be adjusted at any time.`,
      },
      {
        q: 'Do you ship across the United States?',
        a: 'Yes. We ship to addresses in all 50 states and the District of Columbia. Alaska, Hawaii and other non-contiguous addresses take a few days longer in transit.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Not through this website — checkout currently accepts US addresses only. If you are outside the United States, contact us before ordering and we will tell you whether we can help and what it would cost.',
      },
      {
        q: 'How do I track my order?',
        a: 'When your order ships we email you the carrier and tracking number. Tracking usually becomes active within a few hours of the carrier scanning the parcel.',
      },
      {
        q: 'What if I am not home when the carrier arrives?',
        a: 'Carriers generally leave the parcel if it is safe to do so, or leave a notice with instructions to reschedule or arrange collection. Delivery handling is set by the carrier rather than by us.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    items: [
      {
        q: 'What payment methods can I use?',
        a: PAYMENT.cardEnabled
          ? 'You can pay by credit or debit card at checkout.'
          : `Online card payment is being prepared and is not connected yet.${
              PAYMENT.codEnabled
                ? ' In the meantime you can order with Cash on Delivery, where you pay the carrier when your parcel arrives.'
                : ' Please contact us to arrange an order in the meantime.'
            }`,
      },
      {
        q: 'Can I pay by credit or debit card?',
        a: PAYMENT.cardEnabled
          ? 'Yes — card payment is available at checkout.'
          : 'Not yet. Card payment appears at checkout because the store is being prepared for it, but it is disabled. No card number, expiry date or security code is requested or stored anywhere on this website, and no payment is ever simulated.',
      },
      {
        q: 'Is there an extra charge for Cash on Delivery?',
        a:
          PAYMENT.codSurcharge > 0
            ? `Yes — a Cash on Delivery handling charge of ${formatPrice(PAYMENT.codSurcharge)} applies.`
            : 'No. There is no additional handling charge for paying on delivery.',
      },
      {
        q: 'Is there a limit on Cash on Delivery orders?',
        a: `Cash on Delivery is available on orders up to ${formatPrice(PAYMENT.codOrderLimit)}. For larger orders, contact us and we will arrange an alternative.`,
      },
      {
        q: 'Do you charge sales tax?',
        a: TAX.enabled
          ? `Sales tax is applied at ${(TAX.rate * 100).toFixed(2)}% and shown as a separate line at checkout.`
          : 'Sales tax is not calculated on this website. US sales tax is destination-based and varies by state, county and city, so rather than apply a single rate that would be wrong for most addresses, any applicable tax is handled at fulfilment.',
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
        a: `Email ${CONTACT.email} within 48 hours of delivery with your order number and clear photographs of the item and its packaging. We will arrange a replacement or a refund.`,
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
