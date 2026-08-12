import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { getProductsByCategory } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/Icons';

export const metadata = {
  title: 'Product Categories',
  description:
    'Explore Core Byte Media LLC product categories — t-shirts, oversized tees, hoodies, sweatshirts, polo shirts, caps, mugs, tote bags and fully custom products.',
  alternates: { canonical: '/categories' },
  openGraph: {
    title: 'Product Categories | Core Byte Media LLC',
    description: 'Nine categories of premium print-on-demand apparel and accessories.',
    url: '/categories',
  },
};

export default function CategoriesPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <PageHeader
        eyebrow="Browse"
        title="Product Categories"
        description="Nine base products, each chosen for how it prints as much as how it wears. Pick a category to see everything in it, or start from a blank piece in the customiser."
        className="mt-6"
      />

      <div className="mt-12 space-y-4 lg:space-y-5">
        {CATEGORIES.map((category, index) => {
          const count = category.isCustom ? null : getProductsByCategory(category.slug).length;
          const href = category.href || `/products?category=${category.slug}`;
          const reversed = index % 2 === 1;

          return (
            <Reveal key={category.slug} delay={Math.min(index, 4) * 60}>
              <article
                className={`group grid overflow-hidden rounded-xl border border-line bg-graphite transition-all duration-500 hover:border-gold/30 sm:grid-cols-[minmax(0,18rem)_1fr] ${
                  reversed ? 'sm:grid-cols-[1fr_minmax(0,18rem)]' : ''
                }`}
              >
                <div
                  className={`relative aspect-16/10 overflow-hidden bg-obsidian sm:aspect-auto sm:min-h-[15rem] ${
                    reversed ? 'sm:order-2' : ''
                  }`}
                >
                  <Image
                    src={category.image}
                    alt={`${category.name} — Core Byte Media LLC`}
                    fill
                    sizes="(max-width: 640px) 100vw, 288px"
                    priority={index < 2}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent sm:bg-gradient-to-r"
                  />
                </div>

                <div className={`flex flex-col justify-center gap-4 p-6 sm:p-8 ${reversed ? 'sm:order-1' : ''}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl text-cream transition-colors group-hover:text-gold">
                      {category.name}
                    </h2>
                    {count != null && (
                      <span className="rounded-full border border-line px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    )}
                    {category.isCustom && (
                      <span className="rounded-full bg-gold px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink">
                        Your design
                      </span>
                    )}
                  </div>

                  <p className="max-w-xl text-sm leading-relaxed text-muted">
                    {category.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-5">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:bg-gold/10"
                    >
                      {category.isCustom ? 'Start Designing' : 'View Products'}
                      <ArrowRightIcon
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                    {!category.isCustom && (
                      <span className="text-xs text-faint">From {formatPrice(category.from)}</span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-14 flex flex-col items-center gap-5 rounded-xl border border-gold/20 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(201,162,39,0.09),transparent)] px-6 py-12 text-center">
        <span className="eyebrow">Not sure where to start?</span>
        <h2 className="max-w-lg text-balance text-2xl text-cream sm:text-3xl">
          Browse everything in one grid and filter it down
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/products">Shop All Products</Button>
          <Button href="/customize" variant="outline">
            Customize Your Product
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
