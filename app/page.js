import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CustomPrinting from '@/components/home/CustomPrinting';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import NewsletterSection from '@/components/home/NewsletterSection';
import { BRAND } from '@/data/site';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `${BRAND.name} — Premium Print-on-Demand Apparel & Accessories`,
  description:
    'Premium custom apparel and accessories printed to order in the USA. Shop t-shirts, hoodies, mugs, caps and totes, or upload your own design. Free US shipping over $75.',
  path: '/',
  shareTitle: `${BRAND.name} — Designed for You. Made to Stand Out.`,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <CustomPrinting />
      <HowItWorks />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
