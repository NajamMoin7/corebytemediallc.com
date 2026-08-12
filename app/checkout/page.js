import CheckoutView from '@/components/CheckoutView';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Checkout',
  description:
    'Complete your Core Byte Media LLC order with Cash on Delivery. Enter your delivery details and place your order.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        description="Enter your delivery details and confirm. Cash on Delivery means you pay the courier when the parcel reaches you."
        className="mt-6"
      />

      <div className="mt-10">
        <CheckoutView />
      </div>
    </div>
  );
}
