import Image from 'next/image';
import { BRAND } from '@/data/site';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import { pageMetadata } from '@/lib/seo';
import {
  ArrowRightIcon,
  LeafIcon,
  PackageIcon,
  PaletteIcon,
  ShieldIcon,
  SparkleIcon,
  TruckIcon,
} from '@/components/ui/Icons';

export const metadata = pageMetadata({
  title: 'About Us',
  description:
    'Core Byte Media LLC is a modern digital and print-on-demand brand producing premium customised apparel and accessories. Read about our mission, values and quality commitment.',
  path: '/about',
  shareTitle: 'About Core Byte Media LLC',
});

const VALUES = [
  {
    Icon: SparkleIcon,
    title: 'Quality over volume',
    body: 'We would rather carry eight products we can stand behind than eighty we cannot. Every base garment is specified by fabric weight and construction, and those numbers are published on the product page.',
  },
  {
    Icon: PaletteIcon,
    title: 'Your design, your rights',
    body: 'Custom work belongs to the person who made it. We print what you send, we do not reuse it, and we ask that you only send artwork you have the right to reproduce.',
  },
  {
    Icon: ShieldIcon,
    title: 'Say what is true',
    body: 'If a delivery is running late, we say so. If a colour will not reproduce exactly, we say that too. Nothing on this site claims a capability we do not have.',
  },
  {
    Icon: LeafIcon,
    title: 'Print only what is ordered',
    body: 'Print-on-demand exists because bulk production creates waste. Nothing is printed until someone has ordered it, which means no unsold stock going nowhere.',
  },
];

const PROCESS = [
  {
    Icon: PackageIcon,
    step: 'Sourcing',
    body: 'Base garments are selected on fabric weight, collar construction and how cleanly they take ink — in that order.',
  },
  {
    Icon: PaletteIcon,
    step: 'Printing',
    body: 'Artwork is placed to the position you set in the customiser, then printed and cured so it survives the wash rather than the first photograph.',
  },
  {
    Icon: TruckIcon,
    step: 'Dispatch',
    body: 'Each order is checked against the design before it is packed, then handed to a carrier for delivery anywhere in the United States, with tracking emailed to you.',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="container-page py-8 lg:py-12">
        <Breadcrumb items={[{ label: 'About' }]} />

        <PageHeader
          eyebrow="Who we are"
          title="A print-on-demand studio built on the details"
          description={BRAND.description}
          className="mt-6"
        />
      </div>

      {/* Introduction */}
      <section className="border-y border-line bg-graphite/40" aria-labelledby="intro-heading">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <Reveal>
            <span className="eyebrow">Company introduction</span>
            <h2 id="intro-heading" className="mt-4 text-balance text-3xl leading-tight text-cream sm:text-4xl">
              Custom production without the minimum order
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              <p>
                Core Byte Media LLC exists because getting one good custom garment printed used to be
                harder than getting five hundred mediocre ones. Traditional printing is built around
                bulk: minimum runs, setup charges, and a box of unsold stock at the end of it.
              </p>
              <p>
                We work the other way round. Nothing is printed until it is ordered, which means a
                single tee for one person costs the same per unit as the fiftieth in a team order.
                The trade-off we refuse to make is on the base product — a print is only as good as
                what it sits on.
              </p>
              <p>
                Core Byte Media LLC is a US-based print-on-demand studio. Everything on this site is
                produced to order and shipped to customers across the United States.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl border border-line bg-obsidian">
                <Image
                  src="/products/signature-gold-hoodie-front.svg"
                  alt="Signature Gold Hoodie from the Core Byte Media LLC range"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mt-8 aspect-4/5 overflow-hidden rounded-xl border border-line bg-obsidian">
                <Image
                  src="/products/premium-oversized-tee-front.svg"
                  alt="Premium Oversized Tee from the Core Byte Media LLC range"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / vision */}
      <section className="border-b border-line py-16 lg:py-20" aria-labelledby="mission-heading">
        <div className="container-page">
          <SectionHeading
            eyebrow="Direction"
            title="Mission & vision"
            description="Two statements we actually use when deciding what to make and what to turn down."
            align="center"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-xl border border-line bg-graphite p-8">
                <span className="eyebrow">Mission</span>
                <p className="mt-4 text-lg leading-relaxed text-cream">
                  To make properly-made custom products available to anyone, at any quantity, without
                  the setup costs and minimum orders that put them out of reach.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  That means being honest about what a single-unit run can and cannot achieve, and
                  spending our effort on the base product and the print rather than on the pitch.
                </p>
              </article>
            </Reveal>

            <Reveal delay={100}>
              <article className="h-full rounded-xl border border-line bg-graphite p-8">
                <span className="eyebrow">Vision</span>
                <p className="mt-4 text-lg leading-relaxed text-cream">
                  To be the studio people recommend when someone says &ldquo;I need this printed and
                  I want it to actually last.&rdquo;
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Reputation in this business is built one wash cycle at a time. We would rather grow
                  slowly on repeat orders than quickly on first ones.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-line py-16 lg:py-20" aria-labelledby="values-heading">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we hold to"
            title="Our values"
            description="Four commitments that decide how we handle products, artwork and the awkward conversations."
            align="center"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {VALUES.map(({ Icon, title, body }, index) => (
              <Reveal key={title} delay={index * 80}>
                <article className="flex h-full gap-5 rounded-xl border border-line bg-graphite p-6 transition-colors duration-500 hover:border-gold/30">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="mb-2 text-lg text-cream">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quality commitment */}
      <section
        className="relative border-b border-line py-16 lg:py-20"
        aria-labelledby="quality-heading"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(201,162,39,0.08),transparent_70%)]"
        />

        <div className="container-page relative">
          <SectionHeading
            eyebrow="Quality commitment"
            title="How an order actually gets made"
            description="Three stages, each with a decision we are willing to be held to."
            align="center"
          />

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {PROCESS.map(({ Icon, step, body }, index) => (
              <Reveal as="li" key={step} delay={index * 100}>
                <article className="h-full rounded-xl border border-line bg-graphite p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold">
                      <Icon size={20} />
                    </span>
                    <span className="font-display text-3xl text-gold/20">0{index + 1}</span>
                  </div>
                  <h3 className="mb-2.5 text-lg text-cream">{step}</h3>
                  <p className="text-sm leading-relaxed text-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Custom printing concept */}
      <section className="py-16 lg:py-24" aria-labelledby="custom-concept-heading">
        <div className="container-page">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-gold/20 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(201,162,39,0.1),transparent)] px-6 py-14 text-center sm:px-12">
            <span className="eyebrow">The custom printing idea</span>
            <h2 id="custom-concept-heading" className="text-balance text-3xl text-cream sm:text-4xl">
              One design. One product. No waiting for a batch.
            </h2>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
              Upload a logo, an illustration or a photograph, place it on the product in the browser,
              and order exactly one if that is all you need. The same process handles a full team run
              — the only thing that changes is the quantity field.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button href="/customize" size="lg">
                Customize Your Product
                <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Talk to Us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
