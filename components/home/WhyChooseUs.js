import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import {
  HeadsetIcon,
  PaletteIcon,
  RefreshIcon,
  ShieldIcon,
  SparkleIcon,
  TruckIcon,
} from '../ui/Icons';

const FEATURES = [
  {
    Icon: SparkleIcon,
    title: 'Premium Quality',
    body: 'Fabric weights and finishing are specified per product, and every GSM figure on the site is the one we actually print on.',
  },
  {
    Icon: PaletteIcon,
    title: 'Custom Designs',
    body: 'Upload artwork, position it on a live preview, and order a single piece. No minimum quantity and no setup charge.',
  },
  {
    Icon: TruckIcon,
    title: 'Fast Shipping',
    body: 'Orders are prepared in one to three business days and dispatched nationwide, with major cities typically reached in two to four.',
  },
  {
    Icon: ShieldIcon,
    title: 'Secure Ordering',
    body: 'Cash on Delivery only for now — you pay when the parcel is in your hands. We never ask for card details.',
  },
  {
    Icon: RefreshIcon,
    title: 'Easy Returns',
    body: 'Seven days to return an unused catalogue item. Damaged or incorrect items are replaced regardless of category.',
  },
  {
    Icon: HeadsetIcon,
    title: 'Customer Support',
    body: 'A real person answers. Message us about sizing, artwork or an order and you will normally hear back within a business day.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative border-b border-line py-16 lg:py-24" aria-labelledby="why-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,162,39,0.06),transparent_70%)]"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Why Core Byte Media"
          title="Built on the details that actually matter"
          description="Print-on-demand only works when the base product is right. These are the commitments behind every order."
          align="center"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map(({ Icon, title, body }, index) => (
            <Reveal key={title} delay={Math.min(index, 5) * 70}>
              <article className="group h-full rounded-xl border border-line bg-graphite p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:bg-charcoal/70">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold transition-transform duration-500 group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <h3 className="mb-2.5 text-lg text-cream">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
