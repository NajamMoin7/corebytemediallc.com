import CustomizeProduct from '@/components/CustomizeProduct';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PageHeader from '@/components/PageHeader';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Customize Your Product',
  description:
    'Upload your own artwork and put it on a t-shirt, hoodie, sweatshirt, mug, cap or tote bag. Position, scale and rotate your design on a live preview, then order — no minimum quantity.',
  path: '/customize',
});

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
