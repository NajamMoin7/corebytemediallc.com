import { CONTACT, RETURNS } from '@/data/site';
import PolicyPage, { PolicyList, PolicyNote } from '@/components/PolicyPage';

export const metadata = {
  title: 'Return & Refund Policy',
  description:
    'Return eligibility, the return window, how damaged, incorrect and defective items are handled, the position on customised products, and how refunds and exchanges work.',
  alternates: { canonical: '/returns' },
  openGraph: {
    title: 'Return & Refund Policy | Core Byte Media LLC',
    description: 'What can be returned, within what window, and how refunds are processed.',
    url: '/returns',
  },
};

const SECTIONS = [
  {
    id: 'eligibility',
    title: 'Return eligibility',
    body: (
      <>
        <p>An item can be returned if all of the following are true:</p>
        <PolicyList
          items={[
            'It is a standard catalogue product, not a customised one (see the customised products section below).',
            'It is unused and unwashed, with no marks, odours or signs of wear.',
            'Original tags and packaging are intact.',
            'The return is requested within the return window below.',
            'You can provide the order number.',
          ]}
        />
        <p>
          Items that arrive damaged, defective, or that are not what you ordered are covered
          separately and are not subject to these conditions.
        </p>
      </>
    ),
  },
  {
    id: 'window',
    title: 'Return window',
    body: (
      <>
        <p>
          You have <strong className="text-cream">{RETURNS.windowDays} days from delivery</strong> to
          request a return on an eligible catalogue item. Requests made after that window cannot be
          accepted for a change of mind.
        </p>
        <PolicyList
          items={[
            `Damage or defects: report within 48 hours of delivery, with photographs.`,
            `Change of mind: request within ${RETURNS.windowDays} days of delivery.`,
            'Once approved, please send the item back within 7 days of the approval.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'damaged',
    title: 'Damaged products',
    body: (
      <>
        <p>
          If your parcel or its contents arrive damaged, contact us within 48 hours with your order
          number and clear photographs of the item and the outer packaging.
        </p>
        <PolicyList
          items={[
            'We will arrange a replacement at no cost, or a full refund if you prefer.',
            'You do not pay return shipping when the item arrived damaged.',
            'Keep the packaging until the claim is resolved — couriers sometimes ask to inspect it.',
          ]}
        />
        <p>
          This applies to customised items too. A damaged custom piece is replaced with the same
          design at no additional charge.
        </p>
      </>
    ),
  },
  {
    id: 'incorrect',
    title: 'Incorrect products',
    body: (
      <>
        <p>
          If you receive the wrong product, size, colour or design, that is our error and we fix it
          at our cost.
        </p>
        <PolicyList
          items={[
            'Contact us within 48 hours with your order number and a photograph of what arrived.',
            'We arrange collection of the incorrect item and dispatch the correct one.',
            'You pay nothing extra, and no return shipping charge applies.',
            'If the correct item is unavailable, we issue a full refund including shipping.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'defective',
    title: 'Defective products',
    body: (
      <>
        <p>
          Manufacturing defects — a failed seam, a printing fault, a hardware failure — are covered
          whether or not the item has been worn.
        </p>
        <PolicyList
          items={[
            'Report the defect as soon as you notice it, with photographs.',
            'We will replace the item or refund it once the fault is confirmed.',
            'Return shipping for a confirmed defect is on us.',
          ]}
        />
        <PolicyNote tone="plain">
          Normal wear, fading from repeated washing, damage from ignoring the care instructions, and
          alterations made after delivery are not defects.
        </PolicyNote>
      </>
    ),
  },
  {
    id: 'customised',
    title: 'Customised products',
    body: (
      <>
        <PolicyNote tone="warn" title="Customised items have different return conditions.">
          A custom item is printed to your specification and cannot be resold to anyone else. For
          that reason it cannot be returned for a change of mind, a change of design, or because the
          wrong size was selected at checkout.
        </PolicyNote>
        <p>Customised items are still fully covered when something is wrong on our side:</p>
        <PolicyList
          items={[
            'The item arrives damaged in transit.',
            'There is a manufacturing or printing defect.',
            'The printed design does not match the design and placement you approved.',
            'The garment, size or colour delivered is not the one on your order.',
          ]}
        />
        <p>
          Because size cannot be exchanged on a custom item, please check the size guide on the
          product page before ordering. If you are unsure, message us first — we would rather answer
          a sizing question than print the wrong thing.
        </p>
      </>
    ),
  },
  {
    id: 'non-returnable',
    title: 'Non-returnable items',
    body: (
      <>
        <PolicyList
          items={[
            'Customised and personalised products, except where damaged, defective or incorrect.',
            'Items that have been worn, washed, altered or laundered.',
            'Items returned without tags or original packaging.',
            'Items returned after the return window has closed.',
            'Items damaged after delivery through misuse or by not following the care instructions.',
            'Free items and gifts included with an order.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'refunds',
    title: 'Refund process',
    body: (
      <>
        <p>Once we receive a returned item, the process is:</p>
        <ol className="space-y-3">
          {[
            'We inspect the item against the eligibility conditions — this usually takes ' + RETURNS.inspectionDays + ' business days.',
            'We email you the outcome, whether approved or not, with the reason.',
            `Approved refunds are issued within ${RETURNS.refundDays}.`,
            'Because orders are paid Cash on Delivery, refunds are made by bank transfer to an account in your name. We will ask for those details after approval.',
          ].map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/35 text-[0.68rem] text-gold">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p>
          The original shipping charge is refunded only where the return is due to our error — a
          damaged, defective or incorrect item.
        </p>
      </>
    ),
  },
  {
    id: 'exchanges',
    title: 'Exchange process',
    body: (
      <>
        <p>
          Exchanges follow the same eligibility rules as returns and are available on catalogue items
          only.
        </p>
        <PolicyList
          items={[
            'Contact us with your order number and the size or colour you would like instead.',
            'We confirm availability before you send anything back.',
            'Once the original arrives and passes inspection, the replacement is dispatched.',
            'If the replacement costs more, we invoice the difference; if it costs less, we refund it.',
          ]}
        />
        <p>
          Customised items cannot be exchanged, since the replacement would be a new custom print
          rather than a stock swap.
        </p>
      </>
    ),
  },
  {
    id: 'responsibility',
    title: 'Customer responsibility',
    body: (
      <>
        <PolicyList
          items={[
            'Pack the return securely — items damaged on the way back to us may not qualify for a refund.',
            'Use a trackable courier service and keep the receipt until the refund is settled.',
            'Return shipping for a change of mind is paid by you. We cover it when the fault is ours.',
            'Include the order number inside the parcel so we can match it to your order.',
            'Check the size guide and product details before ordering, particularly for custom items.',
          ]}
        />
        <PolicyNote>
          To start a return, email{' '}
          <a href={`mailto:${CONTACT.supportEmail}`} className="underline underline-offset-2">
            {CONTACT.supportEmail}
          </a>{' '}
          with your order number and what is wrong. Please wait for confirmation before sending
          anything back — unannounced returns are difficult to trace.
        </PolicyNote>
      </>
    ),
  },
];

export default function ReturnsPage() {
  return (
    <PolicyPage
      breadcrumb="Return & Refund Policy"
      eyebrow="Returns"
      title="Return & Refund Policy"
      description="What can be returned and within what window, how we handle damaged and incorrect items, where customised products differ, and how refunds are processed."
      intro={
        <>
          <strong>The short version:</strong> {RETURNS.windowDays} days to return an unused catalogue
          item. Damaged, defective or incorrect items are always covered — including custom ones.
          Custom items cannot be returned for a change of mind or a size chosen in error, because
          they are made specifically for you.
        </>
      }
      sections={SECTIONS}
    />
  );
}
