import Image from 'next/image';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import { ArrowRightIcon, CheckIcon } from '../ui/Icons';

const POINTS = [
  'PNG, JPG and SVG artwork accepted',
  'Move, scale and rotate on a live mockup',
  'Single pieces or a full production run',
  'No setup fees and no minimum order',
];

export default function CustomPrinting() {
  return (
    <section className="relative overflow-hidden border-b border-line" aria-labelledby="custom-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_15%_50%,rgba(201,162,39,0.12),transparent_65%)]"
      />

      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <span className="eyebrow flex items-center gap-3">
            <span className="h-px w-6 bg-gold/60" aria-hidden="true" />
            Custom printing
          </span>

          <h2 id="custom-heading" className="mt-4 text-balance text-3xl leading-tight text-cream sm:text-4xl lg:text-[2.6rem]">
            Have Your Own <span className="text-gradient-gold">Design?</span>
          </h2>

          <p className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted sm:text-base">
            Bring a logo, an illustration, a photograph or a line of text. Pick a base product,
            upload your file, and place it exactly where you want it on the mockup. What you see in
            the preview is the placement we print.
          </p>

          <ul className="mt-7 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-cream/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <CheckIcon size={11} />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/customize" size="lg">
              Customize Your Product
              <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button href="/faq" variant="ghost" size="lg">
              How it works
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-gold/20 bg-obsidian shadow-[0_40px_90px_-50px_rgba(201,162,39,0.7)]">
              <Image
                src="/mockups/tshirt-black.svg"
                alt="Blank black t-shirt mockup ready for a custom design"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />

              {/* Illustrative placement frame over the print area */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[46%] h-[26%] w-[38%] -translate-x-1/2 rounded border-2 border-dashed border-gold/60"
              >
                <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gold bg-ink" />
                <span className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gold bg-ink" />
                <span className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-gold bg-ink" />
                <span className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-gold bg-ink" />
                <span className="absolute inset-0 flex items-center justify-center text-[0.6rem] uppercase tracking-[0.16em] text-gold/80">
                  Your design
                </span>
              </span>
            </div>

            <div className="absolute -bottom-5 -right-3 hidden rounded-xl border border-line bg-graphite/95 px-5 py-4 backdrop-blur-md sm:block">
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-faint">Preview runs</p>
              <p className="mt-1 text-sm font-medium text-gold">entirely in your browser</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
