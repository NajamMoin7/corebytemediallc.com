import CheckoutView from '@/components/CheckoutView';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Checkout',
  description:
    'Complete your Core Byte Media LLC order. Enter your US shipping address, choose a payment method, and place your order.',
  path: '/checkout',
  noindex: true,
  nofollow: true,
});

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        description="Enter your shipping address and confirm your order. We ship to addresses within the United States."
        className="mt-6"
      />

      <div className="mt-10">
        <CheckoutView />
      </div>
    </div>
  );
}
