import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CustomPrinting from '@/components/home/CustomPrinting';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import NewsletterSection from '@/components/home/NewsletterSection';
import { BRAND } from '@/data/site';

export const metadata = {
  title: `${BRAND.name} — Premium Print-on-Demand Apparel & Accessories`,
  description:
    'Premium custom apparel and accessories printed to order. Shop t-shirts, hoodies, mugs, caps and totes, or upload your own design. Cash on Delivery across Pakistan.',
  alternates: { canonical: '/' },
  openGraph: {
    title: `${BRAND.name} — Designed for You. Made to Stand Out.`,
    description:
      'Premium custom apparel and accessories printed to order. No minimum quantity, no setup fees.',
    url: '/',
  },
};

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
