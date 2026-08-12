import Link from 'next/link';
import { BRAND, CONTACT, FOOTER_LINKS, SOCIAL } from '@/data/site';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import { SOCIAL_ICONS, MailIcon, PhoneIcon } from './ui/Icons';

const COLUMNS = [
  { title: 'Company', links: FOOTER_LINKS.company },
  { title: 'Customer Support', links: FOOTER_LINKS.support },
  { title: 'Products', links: FOOTER_LINKS.products },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative mt-auto border-t border-line bg-obsidian">
      {/* Soft gold wash at the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(201,162,39,0.09),transparent_70%)]"
      />

      <div className="container-page relative py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-4">
            <Logo height={44} />
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {BRAND.description}
            </p>

            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-gold"
                >
                  <MailIcon size={16} className="text-gold/70" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phoneHref}`}
                  className="inline-flex items-center gap-2.5 text-muted transition-colors hover:text-gold"
                >
                  <PhoneIcon size={16} className="text-gold/70" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <h2 className="eyebrow mb-5">{column.title}</h2>
              <ul className="space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-muted transition-colors duration-300 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-5">Newsletter</h2>
            <p className="mb-4 text-sm leading-relaxed text-muted">
              New drops and restock notices. No more than a couple of emails a month.
            </p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="rule-gold my-10 opacity-40" aria-hidden="true" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="order-2 text-center text-xs text-faint md:order-1 md:text-left">
            © {year} {BRAND.legalName}. All Rights Reserved.
          </p>

          <ul className="order-1 flex items-center gap-2 md:order-2">
            {SOCIAL.map((profile) => {
              const Icon = SOCIAL_ICONS[profile.key];
              if (!Icon) return null;

              // Profiles without a configured URL render as an inert placeholder
              // rather than a guessed link.
              if (!profile.href) {
                return (
                  <li key={profile.key}>
                    <span
                      title={`${profile.label} — link not configured yet`}
                      aria-label={`${profile.label} — link not configured yet`}
                      className="flex h-9 w-9 cursor-default items-center justify-center rounded-full border border-line text-faint/60"
                    >
                      <Icon size={16} />
                    </span>
                  </li>
                );
              }

              return (
                <li key={profile.key}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${BRAND.shortName} on ${profile.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:text-gold"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              );
            })}
          </ul>

          <ul className="order-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <li>
              <Link href="/privacy-policy" className="text-faint transition-colors hover:text-gold">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-faint transition-colors hover:text-gold">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="text-faint transition-colors hover:text-gold">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-faint transition-colors hover:text-gold">
                Returns
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
