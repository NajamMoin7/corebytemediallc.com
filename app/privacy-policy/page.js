import { BRAND, CONTACT, SITE_URL } from '@/data/site';
import PolicyPage, { PolicyList, PolicyNote } from '@/components/PolicyPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'What information Core Byte Media LLC collects, how it is used, how your browser stores cart and design data, and what rights you have over your information.',
  path: '/privacy-policy',
});

const SECTIONS = [
  {
    id: 'scope',
    title: 'Scope of this policy',
    body: (
      <>
        <p>
          This policy covers {BRAND.legalName} and the website at{' '}
          <span className="font-mono text-xs text-cream">{SITE_URL}</span>.
        </p>
        <PolicyNote title="An honest description of how this website works">
          This is a static storefront. It has no user accounts, no database, and no server-side
          session storage. Cart contents, customisation drafts and order confirmations are kept in
          your own browser using localStorage and sessionStorage. Information you enter at checkout
          or in a form is processed in your browser — this website does not transmit it to a server
          of ours, because there is not one connected yet. Order details reach us by the email
          address given on this page.
        </PolicyNote>
      </>
    ),
  },
  {
    id: 'information-collected',
    title: 'Information collected',
    body: (
      <>
        <p>The categories of information involved when you use this site:</p>
        <PolicyList
          items={[
            <>
              <strong className="text-cream">Contact information</strong> — your name, email address
              and phone number, when you enter them at checkout or in the contact form.
            </>,
            <>
              <strong className="text-cream">Order information</strong> — the products, sizes,
              colours and quantities you select, your delivery address, and any order notes.
            </>,
            <>
              <strong className="text-cream">Uploaded artwork</strong> — files you add in the
              customiser. These are read by your browser and held in your browser; they are not
              uploaded from that page.
            </>,
            <>
              <strong className="text-cream">Website usage</strong> — basic technical information
              your browser sends to whichever service hosts this site, such as IP address and user
              agent. We do not run analytics or advertising trackers on this website.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'contact-information',
    title: 'Contact information',
    body: (
      <>
        <p>
          Name, email and phone number are collected for one reason: to fulfil and deliver your
          order, and to answer you if you write to us. Couriers require a reachable phone number,
          which is why it is a required field at checkout.
        </p>
        <p>
          We do not sell contact details, and we do not add you to a marketing list from a purchase
          alone — the newsletter is a separate, explicit opt-in.
        </p>
      </>
    ),
  },
  {
    id: 'order-information',
    title: 'Order information',
    body: (
      <>
        <p>
          Your order details are used to produce the correct items and get them to the right address.
          The delivery address and phone number are shared with the carrier handling your parcel;
          that is unavoidable if the parcel is to arrive.
        </p>
        <PolicyList
          items={[
            'Order contents are used for production, packing and dispatch.',
            'Delivery address and phone number are passed to the carrier.',
            'Order records are kept for the period needed to handle returns, refunds and accounting obligations.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'website-usage',
    title: 'Website usage',
    body: (
      <>
        <p>
          This website does not include analytics scripts, advertising pixels or third-party
          trackers. Any hosting provider serving these pages will keep standard server logs — that is
          a property of web hosting generally, not something this site adds.
        </p>
        <p>
          If analytics are added later, this policy will be updated before that happens rather than
          after.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: (
      <>
        <p>
          This website sets no tracking cookies. It does use your browser&apos;s own storage to
          remember things between page loads:
        </p>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-charcoal/50">
                <th scope="col" className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold">
                  Key
                </th>
                <th scope="col" className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold">
                  Purpose
                </th>
                <th scope="col" className="px-4 py-3 text-left text-[0.68rem] uppercase tracking-[0.14em] text-gold">
                  Lifetime
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line/60">
                <td className="px-4 py-3 font-mono text-xs text-cream">cbm.cart.v1</td>
                <td className="px-4 py-3">Keeps your cart between visits</td>
                <td className="px-4 py-3">Until cleared</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="px-4 py-3 font-mono text-xs text-cream">cbm.customizer.v1</td>
                <td className="px-4 py-3">Saves your in-progress custom design</td>
                <td className="px-4 py-3">Until cleared</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs text-cream">cbm.orders.v1</td>
                <td className="px-4 py-3">Shows your order confirmation screen</td>
                <td className="px-4 py-3">Until the tab is closed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          All three live on your device only. Clearing your browser&apos;s site data removes them,
          which will also empty your cart and any saved design.
        </p>
      </>
    ),
  },
  {
    id: 'how-used',
    title: 'How information is used',
    body: (
      <PolicyList
        items={[
          'To produce, pack and deliver the items you ordered.',
          'To contact you about an order, including collecting your artwork file for a custom item.',
          'To answer questions you send through the contact form or by email.',
          'To handle returns, exchanges and refunds.',
          'To send newsletter emails, only where you subscribed explicitly.',
        ]}
      />
    ),
  },
  {
    id: 'protection',
    title: 'Data protection',
    body: (
      <>
        <PolicyNote title="What we can and cannot claim">
          Because this site holds no customer database, there is no server-side customer data store
          to secure — and we are not going to claim protections we have not built. What we can say is
          that information reaching us by email is handled by the small number of people who need it
          to fulfil your order, and is not shared beyond that.
        </PolicyNote>
        <p>
          When a backend, order management system and payment gateway are connected, this section
          will be rewritten to describe the actual technical measures in place at that point.
        </p>
        <p>
          One practical note: no method of transmitting information over the internet is completely
          secure. Please do not send card numbers, passwords or identity documents by email.
        </p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    body: (
      <>
        <p>Third parties currently involved in delivering this website and its orders:</p>
        <PolicyList
          items={[
            <>
              <strong className="text-cream">Hosting provider</strong> — serves these pages and keeps
              standard server logs.
            </>,
            <>
              <strong className="text-cream">Shipping carriers</strong> — receive the name, address
              and phone number needed to deliver your parcel.
            </>,
            <>
              <strong className="text-cream">Google Fonts</strong> — the site&apos;s typefaces are
              downloaded and served from this site&apos;s own domain at build time, so your browser
              does not contact Google when you visit.
            </>,
          ]}
        />
        <p>
          Each of these handles your information under its own terms. We do not sell or rent personal
          information to anyone.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    title: 'Payment information',
    body: (
      <>
        <PolicyNote title="Card details are never stored on this site.">
          Card payments are processed by our payment processor, NMI (Network Merchants, LLC). The
          card number, expiry date and security code fields at checkout are hosted by NMI and sent
          directly to them — this storefront never receives or stores them. NMI returns a single-use
          token that we use to complete the charge.
        </PolicyNote>
        <p>
          To process a card payment we share your name, billing and shipping address, email address,
          phone number, order total and order number with NMI, which handles that information under
          its own security standards and privacy policy. We keep the transaction reference NMI
          returns so we can match payments to orders and handle refunds. Orders placed with Cash on
          Delivery are paid in person between you and the carrier, so no payment details reach this
          site at all.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <p>Regarding information you have given us, you can ask to:</p>
        <PolicyList
          items={[
            'See what information we hold about you and your orders.',
            'Have inaccurate details corrected.',
            'Have your information deleted, where we are not required to keep it for accounting or legal reasons.',
            'Unsubscribe from newsletter emails at any time.',
            'Ask a question about how your information has been handled.',
          ]}
        />
        <p>
          Information stored in your own browser is entirely under your control — clearing your site
          data removes it immediately, without needing to ask us.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: 'Contact about privacy',
    body: (
      <>
        <p>Questions about this policy, or a request about your information:</p>
        <PolicyList
          items={[
            <>
              Email:{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:text-champagne">
                {CONTACT.email}
              </a>
            </>,
            <>Phone: {CONTACT.phoneDisplay}</>,
            <>Business: {BRAND.legalName}</>,
          ]}
        />
        <p>{CONTACT.responseTime}</p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      breadcrumb="Privacy Policy"
      eyebrow="Your information"
      title="Privacy Policy"
      description="What information this website involves, where it is stored, who it is shared with, and what we are deliberately not claiming."
      sections={SECTIONS}
    />
  );
}
