import NewsletterForm from '../NewsletterForm';
import Reveal from '../ui/Reveal';

export default function NewsletterSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24" aria-labelledby="newsletter-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(201,162,39,0.12),transparent_70%)]"
      />

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Stay in the loop</span>
          <h2 id="newsletter-heading" className="mt-4 text-balance text-3xl text-cream sm:text-4xl">
            New drops, restocks and the occasional discount
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-muted sm:text-base">
            A couple of emails a month, nothing more. Unsubscribe whenever you like.
          </p>

          <div className="mx-auto mt-8 max-w-lg text-left">
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
