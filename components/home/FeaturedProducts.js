import { getFeaturedProducts } from '@/lib/products';
import ProductGrid from '../ProductGrid';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';
import { ArrowRightIcon } from '../ui/Icons';

export default function FeaturedProducts() {
  const products = getFeaturedProducts(8);

  return (
    <section className="border-b border-line py-16 lg:py-24" aria-labelledby="featured-heading">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured"
            title="This season's picks"
            description="The pieces our customers come back for, across apparel and accessories."
            align="left"
            className="max-w-xl"
          />
          <Reveal delay={100} className="shrink-0">
            <Button href="/products" variant="ghost" size="sm">
              All products
              <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Reveal>
        </div>

        <ProductGrid products={products} columns={4} className="mt-12" />
      </div>
    </section>
  );
}
