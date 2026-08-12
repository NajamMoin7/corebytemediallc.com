import Image from 'next/image';
import Link from 'next/link';
import Button from '../ui/Button';
import { ArrowRightIcon, PaletteIcon, SparkleIcon, TruckIcon } from '../ui/Icons';

const HIGHLIGHTS = [
  { Icon: SparkleIcon, label: 'Premium fabrics' },
  { Icon: PaletteIcon, label: 'Your artwork' },
  { Icon: TruckIcon, label: 'Nationwide delivery' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line" aria-labelledby="hero-heading">
      {/* Ambient background: gold wash + fine grid, both purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_-10%,rgba(201,162,39,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_85%_100%,rgba(201,162,39,0.07),transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(70% 60% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 60% at 50% 40%, black, transparent)',
          }}
        />
      </div>

      <div className="container-page relative grid items-center gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24 xl:py-28">
        {/* Copy */}
        <div className="flex flex-col items-start gap-7 lg:col-span-6 xl:col-span-5">
          <span className="animate-fade-in inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-champagne">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            Print-on-demand studio
          </span>

          <h1
            id="hero-heading"
            className="animate-fade-up text-balance text-4xl leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem] xl:text-6xl"
          >
            Designed for You.
            <br />
            <span className="text-gradient-gold">Made to Stand Out.</span>
          </h1>

          <p
            className="animate-fade-up max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: '120ms' }}
          >
            Premium apparel and accessories printed one order at a time. Choose a product from the
            catalogue, or upload your own artwork and we&apos;ll print exactly what you designed — no
            minimum quantity, no setup fee.
          </p>

          <div
            className="animate-fade-up flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            style={{ animationDelay: '220ms' }}
          >
            <Button href="/products" size="lg">
              Shop Products
              <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button href="/customize" variant="outline" size="lg">
              Customize Your Product
            </Button>
          </div>

          <ul
            className="animate-fade-up flex flex-wrap items-center gap-x-6 gap-y-3 pt-2"
            style={{ animationDelay: '320ms' }}
          >
            {HIGHLIGHTS.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-xs text-muted">
                <Icon size={16} className="text-gold/80" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Product collage */}
        <div className="relative lg:col-span-6 xl:col-span-7">
          <div className="relative mx-auto grid max-w-xl grid-cols-2 gap-4 sm:gap-5 lg:max-w-none">
            <div className="flex flex-col gap-4 pt-8 sm:gap-5 sm:pt-12">
              <HeroTile
                href="/products/signature-gold-hoodie"
                src="/products/signature-gold-hoodie-front.svg"
                alt="Signature Gold Hoodie in black"
                label="Signature Gold Hoodie"
                priority
              />
              <HeroTile
                href="/products/minimal-logo-mug"
                src="/products/minimal-logo-mug-front.svg"
                alt="Minimal Logo Mug in white"
                label="Minimal Logo Mug"
                aspect="aspect-square"
              />
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              <HeroTile
                href="/products/premium-oversized-tee"
                src="/products/premium-oversized-tee-front.svg"
                alt="Premium Oversized Tee in black"
                label="Premium Oversized Tee"
                priority
              />
              <HeroTile
                href="/products/everyday-canvas-tote"
                src="/products/everyday-canvas-tote-front.svg"
                alt="Everyday Canvas Tote in bone"
                label="Everyday Canvas Tote"
                aspect="aspect-square"
              />
            </div>
          </div>

          {/* Floating stat card */}
          <div className="animate-float pointer-events-none absolute -left-2 bottom-8 hidden rounded-xl border border-gold/25 bg-graphite/90 px-5 py-4 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.95)] backdrop-blur-md xl:block">
            <p className="text-2xl font-semibold text-gradient-gold">1</p>
            <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.16em] text-muted">
              Minimum order
              <br />
              quantity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTile({ href, src, alt, label, aspect = 'aspect-4/5', priority = false }) {
  return (
    <Link
      href={href}
      className={`group relative ${aspect} overflow-hidden rounded-xl border border-line bg-obsidian transition-all duration-500 hover:border-gold/40 hover:shadow-[0_28px_60px_-32px_rgba(201,162,39,0.6)]`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 26vw"
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-3 pt-10">
        <span className="block truncate text-xs text-cream transition-colors group-hover:text-gold">
          {label}
        </span>
      </span>
    </Link>
  );
}
