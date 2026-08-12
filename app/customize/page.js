import CustomizeProduct from '@/components/CustomizeProduct';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';

export const metadata = {
  title: 'Customize Your Product',
  description:
    'Upload your own artwork and put it on a t-shirt, hoodie, sweatshirt, mug, cap or tote bag. Position, scale and rotate your design on a live preview, then order — no minimum quantity.',
  alternates: { canonical: '/customize' },
  openGraph: {
    title: 'Customize Your Product | Core Byte Media LLC',
    description:
      'Upload artwork, position it on a live product mockup, and order a single custom piece.',
    url: '/customize',
  },
};

export default function CustomizePage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: 'Customize' }]} />

      <PageHeader
        eyebrow="Design studio"
        title="Customize Your Product"
        description="Pick a base product, upload your artwork, and place it exactly where you want it. Everything happens live in your browser — no account, no minimum order."
        className="mt-6"
      />

      <div className="mt-10">
        <CustomizeProduct />
      </div>
    </div>
  );
}
