import CartView from '@/components/CartView';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Shopping Cart',
  description: 'Review the items in your Core Byte Media LLC cart before checking out.',
  path: '/cart',
  noindex: true,
});

export default function CartPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Cart' }]} />

      <PageHeader
        eyebrow="Your selection"
        title="Shopping Cart"
        description="Adjust quantities or remove items before checkout. Your cart is saved in this browser, so it will still be here if you come back."
        className="mt-6"
      />

      <div className="mt-10">
        <CartView />
      </div>
    </div>
  );
}
