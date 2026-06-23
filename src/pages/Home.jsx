import PageTransition from '../components/PageTransition';
import Hero from '../sections/Hero';
import BrowseByType from '../sections/BrowseByType';
import StatusInventory from '../sections/StatusInventory';
import WhyCarJapan from '../sections/WhyCarJapan';
import FeaturedStory from '../sections/FeaturedStory';
import Showroom from '../sections/Showroom';
import Testimonials from '../sections/Testimonials';
import CTASection from '../components/CTASection';
import { getFeaturedCars, getSoldCars, getUpcomingCars } from '../services/carService';
import { CAR_STATUS } from '../constants';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <StatusInventory
        eyebrow="Featured inventory"
        title="Featured available vehicles"
        description="A curated selection from our showroom floor — each one inspected, documented and ready to drive home."
        fetcher={() => getFeaturedCars(12)}
        viewAllTo={`/inventory?status=${CAR_STATUS.AVAILABLE}`}
      />
      <StatusInventory
        eyebrow="Recently sold"
        title="Recently sold vehicles"
        description="A glimpse of the premium Japanese vehicles we've recently placed with happy owners."
        fetcher={() => getSoldCars(8)}
        viewAllTo={`/inventory?status=${CAR_STATUS.SOLD}`}
        viewAllLabel="View sold vehicles"
        className="bg-white section-py"
      />
      <StatusInventory
        eyebrow="Coming soon"
        title="Upcoming vehicles"
        description="Exciting arrivals on their way — register your interest early for first access."
        fetcher={() => getUpcomingCars(8)}
        viewAllTo={`/inventory?status=${CAR_STATUS.UPCOMING}`}
        viewAllLabel="View upcoming"
        className="bg-mist-100 section-py"
      />
      <BrowseByType />
      <FeaturedStory />
      <WhyCarJapan />
      <Showroom />
      <Testimonials />
      <CTASection />
    </PageTransition>
  );
}
