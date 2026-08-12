import Link from 'next/link';
import { CONTACT, POLICY_UPDATED } from '@/data/site';
import Breadcrumb from './ui/Breadcrumb';
import PageHeader from './PageHeader';
import Reveal from './ui/Reveal';

/**
 * Shared shell for the customer information pages.
 *
 * `sections` is `[{ id, title, body }]` where `body` is JSX. The table of
 * contents is generated from the same array, so headings and links cannot
 * drift apart.
 */
export default function PolicyPage({
  breadcrumb,
  eyebrow,
  title,
  description,
  sections,
  intro = null,
  footer = null,
}) {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: breadcrumb }]} />

      <PageHeader eyebrow={eyebrow} title={title} description={description} className="mt-6" />

      <p className="mt-6 text-xs text-faint">Last updated: {POLICY_UPDATED}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        {/* Table of contents */}
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="eyebrow mb-4">On this page</h2>
          <ol className="space-y-1 border-l border-line">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <span className="shrink-0 tabular-nums text-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          {intro && (
            <div className="mb-10 rounded-xl border border-gold/20 bg-gold/[0.05] p-6 text-sm leading-relaxed text-champagne">
              {intro}
            </div>
          )}

          <div className="space-y-12">
            {sections.map((section, index) => (
              <Reveal
                as="section"
                key={section.id}
                id={section.id}
                delay={Math.min(index, 4) * 50}
                className="scroll-mt-28"
              >
                <h2 className="flex items-baseline gap-3 text-xl text-cream sm:text-2xl">
                  <span className="font-display text-base text-gold/50 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                <div className="prose-policy mt-4 space-y-4 text-sm leading-relaxed text-muted">
                  {section.body}
                </div>
              </Reveal>
            ))}
          </div>

          {footer}

          <div className="mt-14 rounded-xl border border-line bg-graphite p-6">
            <h2 className="text-lg text-cream">Questions about this page?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Email{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-gold hover:text-champagne">
                {CONTACT.email}
              </a>{' '}
              and we will clarify anything that is unclear. {CONTACT.responseTime}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/contact" className="text-gold transition-colors hover:text-champagne">
                Contact us →
              </Link>
              <Link href="/faq" className="text-muted transition-colors hover:text-gold">
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Bulleted list styled consistently across the policy pages. */
export function PolicyList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Callout for the things a customer most needs to notice. */
export function PolicyNote({ tone = 'gold', title, children }) {
  const tones = {
    gold: 'border-gold/25 bg-gold/[0.05] text-champagne',
    warn: 'border-red-500/25 bg-red-500/[0.05] text-red-200',
    plain: 'border-line bg-charcoal/50 text-muted',
  };

  return (
    <div className={`rounded-lg border p-4 text-sm leading-relaxed ${tones[tone] || tones.gold}`}>
      {title && <p className="mb-1.5 font-medium">{title}</p>}
      {children}
    </div>
  );
}
