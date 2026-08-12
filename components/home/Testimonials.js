import Link from 'next/link';
import { IS_SAMPLE_CONTENT, TESTIMONIALS } from '@/data/reviews';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Rating from '../ui/Rating';

export default function Testimonials() {
  return (
    <section className="border-b border-line py-16 lg:py-24" aria-labelledby="reviews-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="Customer reviews"
          title="What people say after wearing it"
          description="Feedback across apparel, accessories and custom orders."
          align="center"
        />

        {IS_SAMPLE_CONTENT && (
          <Reveal className="mt-6 flex justify-center">
            <p className="rounded-full border border-line bg-charcoal/60 px-4 py-2 text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              Sample content — demonstration reviews, not real customer feedback
            </p>
          </Reveal>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {TESTIMONIALS.map((review, index) => (
            <Reveal key={review.id} delay={Math.min(index, 5) * 70}>
              <figure className="flex h-full flex-col rounded-xl border border-line bg-graphite p-6 transition-colors duration-500 hover:border-gold/25">
                <span
                  aria-hidden="true"
                  className="mb-4 font-display text-4xl leading-none text-gold/25"
                >
                  &ldquo;
                </span>

                <Rating value={review.rating} showValue={false} size={15} className="mb-3" />

                <blockquote className="flex-1">
                  <p className="mb-2 text-sm font-medium text-cream">{review.title}</p>
                  <p className="text-sm leading-relaxed text-muted">{review.body}</p>
                </blockquote>

                <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="min-w-0">
                    <span className="block text-sm text-cream">{review.name}</span>
                    <span className="block text-xs text-faint">{review.location}</span>
                  </span>
                  <Link
                    href={`/products/${review.productSlug}`}
                    className="shrink-0 text-right text-[0.68rem] leading-tight text-gold/80 transition-colors hover:text-gold"
                  >
                    {review.product}
                  </Link>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
