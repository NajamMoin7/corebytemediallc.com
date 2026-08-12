import ProductCard from './ProductCard';
import Reveal from './ui/Reveal';
import { cn } from '@/lib/utils';

const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

/**
 * Responsive product grid with a staggered reveal.
 * `priorityCount` marks the first N images as high priority for LCP.
 */
export default function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
  emptyState = null,
  className = '',
}) {
  if (!products.length) {
    return emptyState;
  }

  return (
    <div className={cn('grid gap-4 sm:gap-5 lg:gap-6', COLUMN_CLASSES[columns] || COLUMN_CLASSES[4], className)}>
      {products.map((product, index) => (
        <Reveal key={product.id} delay={Math.min(index, 7) * 60} className="flex">
          <ProductCard product={product} priority={index < priorityCount} className="w-full" />
        </Reveal>
      ))}
    </div>
  );
}
