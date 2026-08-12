import Link from 'next/link';
import { ALL_FAQS, FAQ_GROUPS } from '@/data/faqs';
import { CONTACT } from '@/data/site';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers about ordering, customisation and uploaded artwork, shipping times, Cash on Delivery, card payment availability, returns and sizing at Core Byte Media LLC.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ | Core Byte Media LLC',
    description: 'Ordering, customisation, shipping, payment, returns and sizing — answered.',
    url: '/faq',
  },
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ALL_FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <PageHeader
        eyebrow="Answers"
        title="Frequently Asked Questions"
        description="Ordering, customisation, shipping, payment, returns and sizing. If something is not here, ask us directly."
        className="mt-6"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="eyebrow mb-4">Topics</h2>
          <ul className="space-y-1 border-l border-line">
            {FAQ_GROUPS.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="-ml-px flex items-center justify-between gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  {group.title}
                  <span className="text-xs text-faint tabular-nums">{group.items.length}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-gold/20 bg-gold/[0.05] p-5">
            <h3 className="text-sm text-champagne">Still stuck?</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Email{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:text-champagne">
                {CONTACT.email}
              </a>{' '}
              — {CONTACT.responseTime.toLowerCase()}
            </p>
          </div>
        </nav>

        <div className="min-w-0 space-y-12">
          {FAQ_GROUPS.map((group, groupIndex) => (
            <Reveal
              as="section"
              key={group.id}
              id={group.id}
              delay={Math.min(groupIndex, 3) * 60}
              className="scroll-mt-28"
            >
              <h2 className="mb-5 text-xl text-cream sm:text-2xl">{group.title}</h2>

              <div className="divide-y divide-line rounded-xl border border-line bg-graphite">
                {group.items.map((item) => (
                  <details key={item.q} className="group px-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm text-cream transition-colors marker:hidden hover:text-gold">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-gold transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-5 pr-10 text-sm leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          ))}

          <Reveal className="rounded-xl border border-line bg-graphite p-7">
            <h2 className="text-lg text-cream">Did not find your answer?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              The policy pages go into more detail on shipping, returns and the terms that apply to
              uploaded artwork. Or write to us and a person will answer.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="sm">
                Contact Us
              </Button>
              <Button href="/shipping" variant="outline" size="sm">
                Shipping Details
              </Button>
              <Button href="/returns" variant="ghost" size="sm">
                Return Policy
              </Button>
            </div>
            <p className="mt-5 text-xs text-faint">
              Looking for something to order?{' '}
              <Link href="/products" className="text-muted underline underline-offset-2 hover:text-gold">
                Browse the catalogue
              </Link>{' '}
              or{' '}
              <Link href="/customize" className="text-muted underline underline-offset-2 hover:text-gold">
                start a custom design
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
