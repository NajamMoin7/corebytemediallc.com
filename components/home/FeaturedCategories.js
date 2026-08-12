import { CATEGORIES } from '@/data/categories';
import CategoryCard from '../CategoryCard';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Button from '../ui/Button';

const FEATURED_SLUGS = [
  't-shirts',
  'hoodies',
  'sweatshirts',
  'mugs',
  'caps',
  'tote-bags',
  'custom-products',
];

export default function FeaturedCategories() {
  const categories = FEATURED_SLUGS.map((slug) =>
    CATEGORIES.find((category) => category.slug === slug),
  ).filter(Boolean);

  return (
    <section className="border-b border-line py-16 lg:py-24" aria-labelledby="categories-heading">
      <div className="container-page">
        <SectionHeading
          eyebrow="Shop by category"
          title="Start with the right base"
          description="Every product is printed to order. Pick the piece that suits the design — heavier fabrics for bold graphics, lighter ones for fine detail."
          align="center"
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal
              key={category.slug}
              delay={Math.min(index, 6) * 70}
              className={index === 6 ? 'col-span-2 lg:col-span-1' : ''}
            >
              <CategoryCard category={category} priority={index < 2} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center" delay={120}>
          <Button href="/categories" variant="outline">
            View All Categories
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
