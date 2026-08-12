import { Suspense } from 'react';
import ProductsBrowser from '@/components/ProductsBrowser';
import ProductGrid from '@/components/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { getAllProducts, sortProducts } from '@/lib/products';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'All Products',
  description:
    'Browse the full Core Byte Media LLC catalogue — t-shirts, oversized tees, hoodies, sweatshirts, polos, caps, mugs and tote bags. Filter by category, price and availability.',
  path: '/products',
});

export default function ProductsPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Products' }]} />

      <PageHeader
        eyebrow="Catalogue"
        title="All Products"
        description="Every piece is printed to order. Filter by category, set a budget, or search for something specific."
        className="mt-6"
      />

      <div className="mt-10">
        {/*
          ProductsBrowser reads the URL search params, so it needs a Suspense
          boundary. The fallback is what gets prerendered into the static HTML,
          so it renders the real (unfiltered) catalogue rather than a spinner —
          crawlers and no-JS visitors get the full product list, and the
          interactive filters take over on hydration.
        */}
        <Suspense fallback={<ProductsFallback />}>
          <ProductsBrowser />
        </Suspense>
      </div>
    </div>
  );
}

/** Server-rendered catalogue: the full grid, default order, no filters applied. */
function ProductsFallback() {
  const products = sortProducts(getAllProducts(), 'featured');

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
      <div className="hidden lg:block" aria-hidden="true" />
      <div className="min-w-0">
        <h2 className="sr-only">Products</h2>
        <p className="text-xs text-faint">
          Showing {products.length} of {products.length} products
        </p>
        <ProductGrid products={products} columns={3} priorityCount={3} className="mt-5" />
      </div>
    </div>
  );
}
