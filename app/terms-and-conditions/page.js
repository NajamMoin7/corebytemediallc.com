import { BRAND, CONTACT, PAYMENT, RETURNS, SHIPPING, SITE_URL, TAX } from '@/data/site';
import { formatPrice } from '@/lib/utils';
import PolicyPage, { PolicyList, PolicyNote } from '@/components/PolicyPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms of use for the Core Byte Media LLC website — orders, pricing, cancellation, Cash on Delivery, customised products, intellectual property in uploaded designs, prohibited content and liability.',
  path: '/terms-and-conditions',
});

const SECTIONS = [
  {
    id: 'website-usage',
    title: 'Website usage',
    body: (
      <>
        <p>
          By browsing or ordering from <span className="font-mono text-xs text-cream">{SITE_URL}</span>{' '}
          you agree to these terms. If you do not agree with them, please do not use the website.
        </p>
        <PolicyList
          items={[
            'You must be legally able to enter into a contract in your jurisdiction to place an order.',
            'You agree to give accurate delivery and contact details.',
            'You agree not to interfere with the website, attempt to gain unauthorised access, or use automated tools to scrape or overload it.',
            'We may update, suspend or withdraw any part of the website without notice.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'product-information',
    title: 'Product information',
    body: (
      <>
        <p>
          We describe products as accurately as we can, including fabric weights, materials and
          measurements. Some variation is inherent to the products themselves:
        </p>
        <PolicyList
          items={[
            'Screen colours differ between devices; the colour name is the reliable reference, not the pixel colour.',
            'Product imagery on this site is representative — it shows the cut, colourway and print placement rather than acting as a photographic proof.',
            'Garment measurements are taken flat and may vary by up to half an inch.',
            'Garment-dyed items vary slightly in shade between units by nature of the process.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'pricing',
    title: 'Pricing',
    body: (
      <>
        <PolicyList
          items={[
            'All prices are shown in US Dollars (USD) and exclude any sales tax that may apply.',
            'Prices may change at any time, but the price shown when you place an order is the price for that order.',
            `Standard shipping is charged separately at ${formatPrice(SHIPPING.standardRate)} per order, and is free on orders of ${formatPrice(SHIPPING.freeShippingThreshold)} or more.`,
            'If a product is listed at an obviously incorrect price due to an error, we will contact you before processing rather than fulfilling or cancelling silently.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'taxes',
    title: 'Taxes',
    body: TAX.enabled ? (
      <p>
        Sales tax is applied at {(TAX.rate * 100).toFixed(2)}% and shown as a separate line in your
        order summary before you confirm.
      </p>
    ) : (
      <>
        <p>
          Sales tax is not calculated by this website. US sales tax is destination-based and varies
          by state, county and city, so no single rate could be applied accurately here.
        </p>
        <PolicyList
          items={[
            'Prices shown are exclusive of any sales tax that may apply to your order.',
            'Where sales tax is due, it is determined and handled at fulfilment.',
            'You are responsible for any duties or taxes arising from an address outside our stated delivery area.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'orders',
    title: 'Orders',
    body: (
      <>
        <p>
          Placing an order is an offer to buy. The order is accepted when we confirm it and begin
          preparing your items.
        </p>
        <PolicyList
          items={[
            'You will see an order number on the confirmation screen — keep it for any correspondence.',
            'We may decline an order where stock is unavailable, the delivery address is outside our delivery area, or the order appears fraudulent.',
            'For customised orders, we contact you to collect the artwork file before printing begins.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'cancellation',
    title: 'Order cancellation',
    body: (
      <>
        <PolicyList
          items={[
            'Standard catalogue orders can be cancelled before dispatch — contact us as soon as possible with your order number.',
            'Customised orders can be cancelled only before printing starts. Once your artwork is on the press, the order cannot be cancelled.',
            'We may cancel an order if we cannot fulfil it, if the delivery address is unreachable, or if repeated delivery attempts fail.',
            'Because payment is taken on delivery, a cancellation before dispatch means nothing has been charged.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'payment-methods',
    title: 'Payment methods',
    body: (
      <>
        <PolicyNote tone="warn" title="Online card payment is not connected yet.">
          A card payment option appears at checkout because the storefront is being prepared for one,
          but it is disabled. Selecting it displays a notice and does not place an order. No card
          payment is processed, simulated or recorded, and there are no fields anywhere on this
          website that request a card number, expiry date or security code.
        </PolicyNote>
        {PAYMENT.codEnabled && (
          <>
            <p>
              While card payment is being prepared, orders can be completed with Cash on Delivery.
              Payment is made to the carrier at the point of delivery.
            </p>
            <PolicyList
              items={[
                'The amount payable is the order total shown at checkout, including shipping.',
                'Please have the exact amount ready — carriers may not carry change.',
                `Cash on Delivery is available on orders up to ${formatPrice(PAYMENT.codOrderLimit)}.`,
                'Availability depends on the carrier serving your address supporting payment on delivery. Where it is not supported, we will contact you before dispatch.',
                'Refusing delivery without a valid reason, or repeatedly failing to accept parcels, may result in us declining future Cash on Delivery orders.',
              ]}
            />
          </>
        )}
      </>
    ),
  },
  {
    id: 'customised',
    title: 'Customised products',
    body: (
      <>
        <p>
          A customised product is printed to your specification and is not a stock item. That changes
          what we can offer:
        </p>
        <PolicyList
          items={[
            'Custom items cannot be returned or exchanged for a change of mind, a change of design, or a size selected in error.',
            'Custom items are covered if they arrive damaged, defective, or do not match the design and placement you approved.',
            'The customiser preview approximates placement and scale. It is not a colour proof.',
            'We may ask for a higher-resolution file if the artwork you send would print poorly, and we will tell you before printing rather than after.',
            'We may decline to print artwork that appears to infringe someone else’s rights or falls under prohibited content below.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    body: (
      <>
        <p>
          The {BRAND.name} name, logo, website design, product photography and written content on
          this site belong to {BRAND.legalName} and may not be copied or reused without permission.
        </p>
        <p>
          Artwork you upload remains yours. We use it only to produce your order and do not resell,
          redistribute or add it to any catalogue of our own.
        </p>
      </>
    ),
  },
  {
    id: 'customer-designs',
    title: 'Customer-uploaded designs',
    body: (
      <>
        <PolicyNote title="You are responsible for the rights to what you upload.">
          By uploading a logo, illustration, photograph, trademark, typeface or any other artwork,
          you confirm that you own it or have the necessary permission or licence to reproduce it on
          a printed product. This includes third-party logos, brand marks, sports team crests,
          characters, stock imagery and photographs of other people.
        </PolicyNote>
        <PolicyList
          items={[
            'You keep ownership of your artwork; you grant us permission to reproduce it solely to fulfil your order.',
            'You agree to indemnify us against claims arising from artwork you supplied without the necessary rights.',
            'We may refuse any design we reasonably believe infringes another party’s rights, and we will refund an order declined on those grounds.',
            'We do not review every file for rights clearance, and printing a design is not a statement that we have verified it.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'prohibited-content',
    title: 'Prohibited content',
    body: (
      <>
        <p>We will not print designs that contain:</p>
        <PolicyList
          items={[
            'Third-party trademarks, logos or copyrighted work used without permission.',
            'Content that incites hatred or violence against people or groups.',
            'Sexually explicit material, or any material involving minors.',
            'Content promoting illegal activity, terrorism or extremist organisations.',
            'Harassment of, or defamatory content about, an identifiable individual.',
            'Deliberately misleading claims, counterfeit branding, or impersonation of a real business or person.',
          ]}
        />
        <p>
          Orders containing prohibited content are cancelled and refunded. We do not send the artwork
          on to anyone else.
        </p>
      </>
    ),
  },
  {
    id: 'shipping-terms',
    title: 'Shipping',
    body: (
      <>
        <p>
          Delivery is handled by third-party carriers. Timeframes on the shipping page are estimates
          based on typical carrier performance — they are not guaranteed delivery dates.
        </p>
        <PolicyList
          items={[
            `Items are made to order in ${SHIPPING.estimate.processingDays}, then transit time applies on top.`,
            'Orders are shipped to addresses within the United States. International orders are not available through this website.',
            'Risk in the goods passes to you on delivery.',
            'You are responsible for providing an accurate delivery address and a reachable phone number.',
            'Repeated failed deliveries caused by incorrect details may incur a further shipping charge.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'returns-terms',
    title: 'Returns and refunds',
    body: (
      <>
        <p>
          Returns are governed by our Return &amp; Refund Policy, which forms part of these terms.
        </p>
        <PolicyList
          items={[
            `Unused catalogue items may be returned within ${RETURNS.windowDays} days of delivery.`,
            'Damaged, defective or incorrect items are replaced or refunded, including customised items.',
            'Customised items are not returnable for a change of mind.',
            `Approved refunds are issued within ${RETURNS.refundDays} of the returned item being inspected.`,
          ]}
        />
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <>
        <p>
          To the extent permitted by law, our liability in connection with an order is limited to the
          amount paid for that order.
        </p>
        <PolicyList
          items={[
            'We are not liable for delays caused by carriers, weather, strikes or other events outside our control.',
            'We are not liable for indirect or consequential loss, such as loss of profit or a missed event date.',
            'We are not liable for issues arising from artwork supplied without the necessary rights.',
            'We are not liable for damage caused after delivery by misuse or by not following the care instructions.',
            'Nothing here limits liability that cannot lawfully be limited.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'updates',
    title: 'Policy updates',
    body: (
      <>
        <p>
          These terms may be updated as the business changes — particularly when payment, accounts or
          order tracking are added. The revision date at the top of this page reflects the current
          version.
        </p>
        <p>
          Orders are governed by the terms in force when the order was placed, not by a later
          revision.
        </p>
      </>
    ),
  },
  {
    id: 'contact-terms',
    title: 'Contact information',
    body: (
      <>
        <p>Questions about these terms:</p>
        <PolicyList
          items={[
            <>Business: {BRAND.legalName}</>,
            <>
              Email:{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:text-champagne">
                {CONTACT.email}
              </a>
            </>,
            <>Phone: {CONTACT.phoneDisplay}</>,
            <>Website: <span className="font-mono text-xs">{SITE_URL}</span></>,
          ]}
        />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      breadcrumb="Terms & Conditions"
      eyebrow="The agreement"
      title="Terms & Conditions"
      description="The terms that apply when you use this website and place an order — including who is responsible for uploaded artwork and what card payment currently does."
      intro={
        <>
          <strong>Two things worth reading first:</strong> online card payment is shown but not
          connected yet, so orders are completed with Cash on Delivery for now. And if you upload
          artwork, you are confirming you have the right to have it printed.
        </>
      }
      sections={SECTIONS}
    />
  );
}
