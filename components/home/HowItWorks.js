import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { CartIcon, PackageIcon, PaletteIcon, UploadIcon } from '../ui/Icons';

const STEPS = [
  {
    Icon: PackageIcon,
    title: 'Choose a Product',
    body: 'Pick the base — tee, hoodie, sweatshirt, mug, cap or tote — then set the size and colour.',
  },
  {
    Icon: UploadIcon,
    title: 'Upload Your Design',
    body: 'Drop in a PNG, JPG or SVG. The file is read in your browser, so nothing is sent anywhere yet.',
  },
  {
    Icon: PaletteIcon,
    title: 'Customize & Preview',
    body: 'Move, scale and rotate your artwork on the mockup until the placement is right.',
  },
  {
    Icon: CartIcon,
    title: 'Place Your Order',
    body: 'Add it to the cart, check out with Cash on Delivery, and pay the courier on arrival.',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-line py-16 lg:py-24" aria-labelledby="how-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps from idea to doorstep"
          description="No account required and no minimum order. The whole flow takes a couple of minutes."
          align="center"
        />

        <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line, desktop only */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent lg:block"
          />

          {STEPS.map(({ Icon, title, body }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 110}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <span className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-ink text-gold">
                <Icon size={22} />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-champagne to-gold-dark text-[0.65rem] font-bold text-ink">
                  {index + 1}
                </span>
              </span>

              <h3 className="mb-2.5 text-lg text-cream">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted lg:max-w-none">{body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
