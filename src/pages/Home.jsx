import PageTransition from '../components/PageTransition';
import Hero from '../sections/Hero';
import BrowseByType from '../sections/BrowseByType';
import FeaturedInventory from '../sections/FeaturedInventory';
import WhyCarJapan from '../sections/WhyCarJapan';
import FeaturedStory from '../sections/FeaturedStory';
import Showroom from '../sections/Showroom';
import Testimonials from '../sections/Testimonials';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <FeaturedInventory />
      <BrowseByType />
      <FeaturedStory />
      <WhyCarJapan />
      <Showroom />
      <Testimonials />
      <CTASection />
    </PageTransition>
  );
}
