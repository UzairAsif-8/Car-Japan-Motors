import { Suspense, lazy } from 'react';
import PageTransition from '../components/PageTransition';
import Hero from '../sections/Hero';
import BrowseByType from '../sections/BrowseByType';
import WhyCarJapan from '../sections/WhyCarJapan';
import CTASection from '../components/CTASection';
import SectionFallback from '../components/ui/SectionFallback';
import { getSoldCars, getUpcomingCars } from '../services/carService';
import { CAR_STATUS } from '../constants';

const FeaturedInventory = lazy(() => import('../sections/FeaturedInventory'));
const StatusInventory = lazy(() => import('../sections/StatusInventory'));
const FeaturedStory = lazy(() => import('../sections/FeaturedStory'));
const Showroom = lazy(() => import('../sections/Showroom'));
const VideoCarousel = lazy(() => import('../sections/VideoCarousel'));
const Testimonials = lazy(() => import('../sections/Testimonials'));

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Suspense fallback={<SectionFallback className="bg-mist-100 section-py" />}>
        <FeaturedInventory />
      </Suspense>
      <Suspense fallback={<SectionFallback className="bg-white section-py" />}>
        <StatusInventory
          eyebrow="Recently sold"
          title="Recently sold vehicles"
          description="A glimpse of the premium Japanese vehicles we've recently placed with happy owners."
          fetcher={() => getSoldCars(8)}
          viewAllTo={`/inventory?status=${CAR_STATUS.SOLD}`}
          viewAllLabel="View sold vehicles"
          className="bg-white section-py"
        />
      </Suspense>
      <Suspense fallback={<SectionFallback className="bg-mist-100 section-py" />}>
        <StatusInventory
          eyebrow="Coming soon"
          title="Upcoming vehicles"
          description="Exciting arrivals on their way — register your interest early for first access."
          fetcher={() => getUpcomingCars(8)}
          viewAllTo={`/inventory?status=${CAR_STATUS.UPCOMING}`}
          viewAllLabel="View upcoming"
          className="bg-mist-100 section-py"
        />
      </Suspense>
      <BrowseByType />
      <Suspense fallback={<SectionFallback className="section-py" />}>
        <FeaturedStory />
      </Suspense>
      <WhyCarJapan />
      <Suspense fallback={<SectionFallback className="section-py" />}>
        <Showroom />
      </Suspense>
      <Suspense fallback={<SectionFallback className="bg-white section-py" />}>
        <VideoCarousel />
      </Suspense>
      <Suspense fallback={<SectionFallback className="section-py" />}>
        <Testimonials />
      </Suspense>
      <CTASection />
    </PageTransition>
  );
}
