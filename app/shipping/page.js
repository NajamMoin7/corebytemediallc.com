import { CONTACT, PAYMENT, SHIPPING, TAX } from '@/data/site';
import { formatPrice } from '@/lib/utils';
import PolicyPage, { PolicyList, PolicyNote } from '@/components/PolicyPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Shipping Information',
  description:
    'Production times, US delivery estimates, standard shipping rates, free shipping over $75, order tracking and delivery delays for Core Byte Media LLC orders.',
  path: '/shipping',
});

const SECTIONS = [
  {
    id: 'processing',
    title: 'Processing time',
    body: (
      <>
        <p>
          Every item is printed after you order it. Nothing sits in a warehouse waiting, which is why
          there is a production stage before your order is handed to a carrier.
        </p>
        <p>
          Production takes <strong className="text-cream">{SHIPPING.estimate.processingDays}</strong>{' '}
          from the time the order is placed.
        </p>
        <PolicyList
          items={[
            'Catalogue items are usually printed and packed within the first two business days.',
            'Custom orders take the full window, because we confirm your artwork file before printing.',
            'Orders placed over a weekend or a US public holiday begin processing on the next business day.',
            'Larger or multi-item orders may take an extra day; we will tell you if that applies.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'standard-shipping',
    title: 'Standard US shipping',
    body: (
      <>
        <p>
          The estimates below start from dispatch, not from when you place the order. Add the
          production time above for the full picture.
        </p>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-charcoal/50">
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold"
                >
                  Destination
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold"
                >
                  Transit time after dispatch
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line/60">
                <td className="px-4 py-3 text-cream">Contiguous United States</td>
                <td className="px-4 py-3">{SHIPPING.estimate.standard}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-cream">
                  Alaska, Hawaii and other non-contiguous addresses
                </td>
                <td className="px-4 py-3">{SHIPPING.estimate.remote}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <PolicyNote tone="plain">
          These are estimates based on typical carrier performance, not guarantees. We do not offer
          guaranteed delivery dates — once a parcel is with the carrier, its transit time is outside
          our control.
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
              <strong className="text-cream">
                Standard shipping: {formatPrice(SHIPPING.standardRate)}
              </strong>{' '}
              per order, regardless of how many items it contains.
            </>,
            <>
              <strong className="text-cream">
                Free standard shipping on orders {formatPrice(SHIPPING.freeShippingThreshold)}+
              </strong>{' '}
              — calculated on the order subtotal, before shipping.
            </>,
            'The exact shipping amount is shown in your cart and again at checkout before you confirm.',
            PAYMENT.codSurcharge > 0
              ? `A Cash on Delivery handling charge of ${formatPrice(PAYMENT.codSurcharge)} applies.`
              : 'There is no additional handling charge for paying on delivery.',
          ]}
        />
        {SHIPPING.isDemoPricing && (
          <PolicyNote title="A note on these figures">
            The rates above are example values for this storefront. They live in a single
            configuration block (<span className="font-mono text-xs">STORE_CONFIG</span> in{' '}
            <span className="font-mono text-xs">data/site.js</span>) and can be changed in one place
            — the cart, checkout, FAQ and this page all read from it.
          </PolicyNote>
        )}
      </>
    ),
  },
  {
    id: 'tax',
    title: 'Sales tax',
    body: TAX.enabled ? (
      <p>
        Sales tax is applied at {(TAX.rate * 100).toFixed(2)}% and shown as a separate line in your
        order summary at checkout.
      </p>
    ) : (
      <>
        <p>
          Sales tax is not calculated on this website. US sales tax is destination-based and varies
          by state, county and city — there is no single rate that would be correct for every
          address. Rather than show a number that would be wrong for most customers, the order
          summary states that any applicable tax is handled at fulfilment.
        </p>
        <PolicyNote tone="plain">
          When a tax service, or a payment provider that calculates tax, is connected, the amount
          will appear as its own line in the cart and at checkout.
        </PolicyNote>
      </>
    ),
  },
  {
    id: 'areas',
    title: 'Delivery areas',
    body: (
      <>
        <p>
          Shipping through this website is intended for addresses within the United States. Checkout
          accepts all 50 states and the District of Columbia.
        </p>
        <PolicyList
          items={[
            'Street addresses and PO boxes are both accepted, though some carriers cannot deliver to a PO box.',
            'APO, FPO and DPO addresses may take considerably longer than the estimates above.',
            'Alaska, Hawaii and other non-contiguous addresses use the longer transit estimate.',
            'International orders are not available through this website. Contact us before ordering if you are outside the US and we will tell you whether we can help.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'payment-on-delivery',
    title: 'Paying on delivery',
    body: PAYMENT.codEnabled ? (
      <>
        <p>
          As an alternative to paying by card at checkout, Cash on Delivery lets you pay the carrier
          when your order is handed to you — nothing is charged beforehand.
        </p>
        <PolicyList
          items={[
            <>
              Available on orders up to {formatPrice(PAYMENT.codOrderLimit)}. For larger orders,
              contact us and we will arrange an alternative.
            </>,
            'Please have the exact order total ready — carriers do not always carry change.',
            'Cash on Delivery depends on the carrier serving your address supporting it. If it is unavailable for your address, we will contact you before dispatch.',
          ]}
        />
        <PolicyNote tone="plain">
          We do not claim Cash on Delivery is available at every US address — availability is set by
          the carrier, not by us.
        </PolicyNote>
      </>
    ) : (
      <p>
        Cash on Delivery is not currently offered. See the checkout page for the payment methods
        available now.
      </p>
    ),
  },
  {
    id: 'tracking',
    title: 'Tracking',
    body: (
      <>
        <p>
          When your order is handed to the carrier, we email you the carrier name and tracking
          number. Tracking usually becomes active within a few hours of the first carrier scan.
        </p>
        <PolicyNote tone="plain">
          This website does not currently have a customer account area or a built-in tracking page —
          tracking is provided by email and followed on the carrier&apos;s own website. An
          order-tracking page is planned alongside the order management system.
        </PolicyNote>
      </>
    ),
  },
  {
    id: 'delays',
    title: 'Delivery delays',
    body: (
      <>
        <p>
          Delivery estimates can slip, and we would rather say so than promise a date we cannot
          control. Common causes:
        </p>
        <PolicyList
          items={[
            'Severe weather and natural events affecting carrier routes.',
            'Carrier network disruption, capacity limits or industrial action.',
            'Peak seasons and US public holidays, when carrier volumes rise sharply.',
            'An incomplete or incorrect delivery address, or an unreachable phone number.',
            'A custom order where we are waiting on your artwork file before printing.',
          ]}
        />
        <p>
          If your order passes its estimated window, email{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-gold hover:text-champagne">
            {CONTACT.email}
          </a>{' '}
          with your order number and we will chase it with the carrier.
        </p>
      </>
    ),
  },
  {
    id: 'delivery-issues',
    title: 'If delivery does not go to plan',
    body: (
      <>
        <p>
          Once a parcel is with the carrier, how delivery is attempted is set by the carrier rather
          than by us. In general:
        </p>
        <PolicyList
          items={[
            'Carriers usually leave the parcel if it is safe to do so, or leave a notice with instructions to reschedule or collect.',
            'Someone else at the address can normally accept the parcel on your behalf.',
            'Add a gate code, buzzer or safe-place instruction in the delivery notes at checkout and we will pass it to the carrier where possible.',
            'If a parcel is returned to us as undeliverable, we will contact you to arrange another dispatch. A second shipping charge may apply where the original address was incorrect.',
            'If tracking shows delivered but the parcel is not there, tell us within 7 days and we will open a claim with the carrier.',
          ]}
        />
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
      description="How long orders take to make and ship, what shipping costs, where we deliver, and what happens when something does not go to plan."
      intro={
        <>
          <strong>The short version:</strong> items are made to order in{' '}
          {SHIPPING.estimate.processingDays}, then typically {SHIPPING.estimate.standard} in transit
          within the contiguous US. Standard shipping is {formatPrice(SHIPPING.standardRate)}, free
          on orders {formatPrice(SHIPPING.freeShippingThreshold)}+.
        </>
      }
      sections={SECTIONS}
    />
  );
}
