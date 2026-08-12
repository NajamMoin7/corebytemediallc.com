import { CONTACT, SHIPPING } from '@/data/site';
import { formatPrice } from '@/lib/utils';
import PolicyPage, { PolicyList, PolicyNote } from '@/components/PolicyPage';

export const metadata = {
  title: 'Shipping Information',
  description:
    'Processing times, delivery estimates, shipping charges, Cash on Delivery availability and order tracking for Core Byte Media LLC orders across Pakistan.',
  alternates: { canonical: '/shipping' },
  openGraph: {
    title: 'Shipping Information | Core Byte Media LLC',
    description: 'Processing times, delivery estimates and Cash on Delivery details.',
    url: '/shipping',
  },
};

const SECTIONS = [
  {
    id: 'processing',
    title: 'Processing time',
    body: (
      <>
        <p>
          Every item is printed after you order it, so there is a production step before anything is
          handed to a courier. Orders are prepared within{' '}
          <strong className="text-cream">{SHIPPING.estimate.processingDays}</strong> of being placed.
        </p>
        <PolicyList
          items={[
            'Catalogue items are usually printed and packed within one to two business days.',
            'Custom orders take the full window, because we confirm your artwork file before printing.',
            'Orders placed on a Friday evening or over the weekend begin processing on the next business day.',
            'Large or multi-item orders may take an extra day; we will tell you if that applies.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'delivery',
    title: 'Estimated delivery',
    body: (
      <>
        <p>
          The estimates below start from dispatch, not from when you place the order. Add the
          processing time above to get the full picture.
        </p>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-charcoal/50">
                <th scope="col" className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold">
                  Destination
                </th>
                <th scope="col" className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold">
                  After dispatch
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line/60">
                <td className="px-4 py-3 text-cream">Major cities</td>
                <td className="px-4 py-3">{SHIPPING.estimate.majorCities}</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="px-4 py-3 text-cream">Other cities and towns</td>
                <td className="px-4 py-3">{SHIPPING.estimate.otherAreas}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-cream">Remote and rural areas</td>
                <td className="px-4 py-3">{SHIPPING.estimate.remoteAreas}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Major cities currently covered by the faster estimate: {SHIPPING.majorCities.join(', ')}.
        </p>
        <PolicyNote tone="plain">
          These are estimates based on typical courier performance, not guarantees. Once a parcel is
          with the courier, its transit time is outside our control.
        </PolicyNote>
      </>
    ),
  },
  {
    id: 'charges',
    title: 'Shipping charges',
    body: (
      <>
        <PolicyList
          items={[
            <>
              Flat rate of <strong className="text-cream">{formatPrice(SHIPPING.flatRate)}</strong>{' '}
              per order, regardless of how many items it contains.
            </>,
            <>
              <strong className="text-cream">Free shipping</strong> on orders over{' '}
              {formatPrice(SHIPPING.freeThreshold)}.
            </>,
            SHIPPING.codSurcharge > 0
              ? `Cash on Delivery handling charge of ${formatPrice(SHIPPING.codSurcharge)}.`
              : 'No additional handling charge for paying Cash on Delivery.',
            'The exact shipping amount is shown in your cart and again at checkout before you confirm.',
          ]}
        />
        {SHIPPING.isDemoPricing && (
          <PolicyNote title="A note on these figures">
            The rates above are example values for this storefront. They live in a single
            configuration file (<span className="font-mono text-xs">data/site.js</span>) and can be
            changed in one place — the cart, checkout and this page all read from it.
          </PolicyNote>
        )}
      </>
    ),
  },
  {
    id: 'areas',
    title: 'Delivery areas',
    body: (
      <>
        <p>
          We deliver across Pakistan through third-party courier partners. Coverage is broad but not
          total — a small number of postcodes are outside the courier network.
        </p>
        <PolicyList
          items={[
            'Nationwide delivery within Pakistan, including smaller towns served by our courier partners.',
            'If your address turns out to be outside the network, we will contact you and refund or re-route the order.',
            'International delivery is not offered through this website. Contact us before ordering if you are outside Pakistan and we will tell you whether we can help.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    body: (
      <>
        <p>
          Cash on Delivery is currently the only payment method available, and it is available across
          our full delivery area within Pakistan.
        </p>
        <PolicyList
          items={[
            'You pay the courier in cash when the parcel is handed to you — nothing is charged beforehand.',
            'Please have the exact order total ready; couriers do not always carry change.',
            <>
              Cash on Delivery is available on orders up to{' '}
              {formatPrice(SHIPPING.codMaxOrderValue)}. For larger orders, contact us to arrange an
              alternative.
            </>,
            'Card payment is not available yet. Nothing on this site collects or stores card details.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'delays',
    title: 'Possible delivery delays',
    body: (
      <>
        <p>Delivery estimates can slip. The usual causes:</p>
        <PolicyList
          items={[
            'Public holidays and peak seasons, when courier volumes rise sharply.',
            'Weather events and road closures affecting the courier route.',
            'An incomplete or incorrect delivery address, or an unreachable phone number.',
            'Courier network disruptions in a particular region.',
            'A custom order where we are waiting on your artwork file before printing.',
          ]}
        />
        <p>
          If your order passes its estimated window, email{' '}
          <a href={`mailto:${CONTACT.supportEmail}`} className="text-gold hover:text-champagne">
            {CONTACT.supportEmail}
          </a>{' '}
          with your order number and we will chase it with the courier.
        </p>
      </>
    ),
  },
  {
    id: 'tracking',
    title: 'Order tracking',
    body: (
      <>
        <p>
          When your parcel is handed to the courier, we email you the tracking number and the
          courier&apos;s tracking link. Tracking usually becomes active within a few hours of
          dispatch.
        </p>
        <PolicyNote tone="plain">
          This website does not currently have an account area or a built-in tracking page — tracking
          is provided by email and followed on the courier&apos;s own website. An order-tracking
          page is planned alongside the order management system.
        </PolicyNote>
      </>
    ),
  },
  {
    id: 'unavailable',
    title: 'If you are not available at delivery',
    body: (
      <>
        <p>
          Couriers call the phone number on the order before attempting delivery, which is why an
          accurate, reachable number matters more than anything else on the form.
        </p>
        <PolicyList
          items={[
            'If you miss the first attempt, the courier will normally try again on the next working day.',
            'Most couriers make two to three attempts before returning the parcel to us.',
            'Someone else at the address can accept the parcel and pay on your behalf.',
            'If the parcel comes back to us, we will contact you to arrange a re-dispatch. A second shipping charge may apply for repeated failed deliveries.',
          ]}
        />
        <p>
          If you know you will be away, reply to your order email or note a preferred delivery window
          in the order notes at checkout — we will pass it to the courier where possible.
        </p>
      </>
    ),
  },
];

export default function ShippingPage() {
  return (
    <PolicyPage
      breadcrumb="Shipping Information"
      eyebrow="Delivery"
      title="Shipping Information"
      description="How long orders take, what shipping costs, where we deliver, and what happens when something does not go to plan."
      intro={
        <>
          <strong>The short version:</strong> orders are prepared in{' '}
          {SHIPPING.estimate.processingDays} and reach major cities in{' '}
          {SHIPPING.estimate.majorCities} after dispatch. Shipping is a flat{' '}
          {formatPrice(SHIPPING.flatRate)}, free over {formatPrice(SHIPPING.freeThreshold)}, and you
          pay the courier in cash on arrival.
        </>
      }
      sections={SECTIONS}
    />
  );
}
