import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import ProductGrid from '@/components/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Rating from '@/components/ui/Rating';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import {
  getAllProducts,
  getCategoryName,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/products';
import { getProductReviews, IS_SAMPLE_CONTENT } from '@/data/reviews';
import { CURRENCY, SITE_URL } from '@/data/site';
import { ArrowLeftIcon } from '@/components/ui/Icons';

/** Pre-render every product page at build time. */
export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const price = product.salePrice ?? product.price;

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} | Core Byte Media LLC`,
      description: product.description,
      url: `/products/${product.slug}`,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images[0].src],
    },
    other: {
      'product:price:amount': String(price),
      'product:price:currency': CURRENCY.code,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const reviews = getProductReviews(product.slug);
  const categoryName = getCategoryName(product.category);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    category: categoryName,
    image: product.images.map((image) => `${SITE_URL}${image.src}`),
    brand: { '@type': 'Brand', name: 'Core Byte Media LLC' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: CURRENCY.code,
      price: product.salePrice ?? product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          { label: categoryName, href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6">
        <Button href="/products" variant="ghost" size="sm" className="-ml-4">
          <ArrowLeftIcon size={15} />
          Back to products
        </Button>
      </div>

      <div className="mt-6 lg:mt-8">
        <ProductDetail product={product} />
      </div>

      {reviews.length > 0 && (
        <section className="mt-20" aria-labelledby="product-reviews-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Customer feedback</span>
              <h2 id="product-reviews-heading" className="mt-3 text-2xl text-cream sm:text-3xl">
                What buyers said
              </h2>
            </div>
            <Rating value={product.rating} count={product.reviews} size={17} />
          </div>

          {IS_SAMPLE_CONTENT && (
            <p className="mt-4 text-xs text-faint">
              Sample content — demonstration reviews, not real customer feedback.
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <Reveal key={`${review.name}-${index}`} delay={index * 70}>
                <figure className="h-full rounded-xl border border-line bg-graphite p-5">
                  <Rating value={review.rating} showValue={false} size={14} className="mb-3" />
                  <blockquote className="text-sm leading-relaxed text-muted">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                    <span className="text-cream">{review.name}</span>
                    <span className="text-faint">{review.date}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">You might also like</span>
              <h2 id="related-heading" className="mt-3 text-2xl text-cream sm:text-3xl">
                Related products
              </h2>
            </div>
            <Button href={`/products?category=${product.category}`} variant="ghost" size="sm">
              All {categoryName}
            </Button>
          </div>

          <ProductGrid products={related} columns={4} className="mt-8" />
        </section>
      )}
    </div>
  );
}
