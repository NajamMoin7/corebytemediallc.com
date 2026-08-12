import Link from 'next/link';
import { CONTACT } from '@/data/site';
import ContactForm from '@/components/ContactForm';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/ui/Reveal';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/ui/Icons';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Core Byte Media LLC about orders, custom printing, sizing or returns. Email, phone and business hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Core Byte Media LLC',
    description: 'Questions about an order, a custom design or sizing? Get in touch.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        description="Questions about an order, a custom design, sizing or a return — send them over and a person will answer."
        className="mt-6"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <Reveal className="min-w-0 order-2 lg:order-1">
          <h2 className="mb-6 text-xl text-cream">Send us a message</h2>
          <ContactForm />
        </Reveal>

        <div className="order-1 space-y-4 lg:order-2">
          <Reveal>
            <InfoCard Icon={MailIcon} title="Email">
              <a href={`mailto:${CONTACT.email}`} className="text-cream transition-colors hover:text-gold">
                {CONTACT.email}
              </a>
              <p className="mt-1 text-xs text-faint">General enquiries and new orders</p>
              <a
                href={`mailto:${CONTACT.supportEmail}`}
                className="mt-3 block text-cream transition-colors hover:text-gold"
              >
                {CONTACT.supportEmail}
              </a>
              <p className="mt-1 text-xs text-faint">Existing orders, returns and issues</p>
            </InfoCard>
          </Reveal>

          <Reveal delay={80}>
            <InfoCard Icon={PhoneIcon} title="Phone">
              <a href={`tel:${CONTACT.phoneHref}`} className="text-cream transition-colors hover:text-gold">
                {CONTACT.phoneDisplay}
              </a>
              <p className="mt-1 text-xs leading-relaxed text-faint">
                Available during business hours. Outside those, email gets a faster reply.
              </p>
            </InfoCard>
          </Reveal>

          <Reveal delay={160}>
            <InfoCard Icon={ClockIcon} title="Business Hours">
              <ul className="space-y-1.5">
                {CONTACT.hours.map((entry) => (
                  <li key={entry.days} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted">{entry.days}</span>
                    <span className="text-right text-cream">{entry.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-faint">{CONTACT.responseTime}</p>
            </InfoCard>
          </Reveal>

          <Reveal delay={240}>
            <InfoCard Icon={MapPinIcon} title="Location">
              <address className="space-y-1 text-sm not-italic leading-relaxed text-muted">
                <p className="text-cream">{CONTACT.location.line1}</p>
                <p>{CONTACT.location.line2}</p>
                <p>{CONTACT.location.city}</p>
              </address>
              <p className="mt-3 text-xs leading-relaxed text-faint">
                We produce and dispatch to order — there is no walk-in showroom.
              </p>
            </InfoCard>
          </Reveal>

          <Reveal delay={320}>
            <div className="rounded-xl border border-gold/20 bg-gold/[0.05] p-5">
              <h3 className="text-sm text-champagne">Looking for a quick answer?</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Sizing, shipping times, returns and how the customiser handles your artwork are all
                covered in the FAQ.
              </p>
              <Link
                href="/faq"
                className="mt-3 inline-flex text-xs uppercase tracking-[0.14em] text-gold transition-colors hover:text-champagne"
              >
                Read the FAQ →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ Icon, title, children }) {
  return (
    <article className="rounded-xl border border-line bg-graphite p-5 transition-colors duration-500 hover:border-gold/30">
      <div className="mb-3.5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold">
          <Icon size={18} />
        </span>
        <h3 className="text-sm uppercase tracking-[0.14em] text-cream">{title}</h3>
      </div>
      <div className="text-sm">{children}</div>
    </article>
  );
}
