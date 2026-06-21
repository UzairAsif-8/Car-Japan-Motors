import { ArrowRight } from 'lucide-react';
import { getFeaturedCars } from '../services/carService';
import useAsync from '../hooks/useAsync';
import VehicleGrid from '../components/VehicleGrid';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';

export default function FeaturedInventory() {
  const { data: cars, loading } = useAsync(() => getFeaturedCars(12), []);

  return (
    <section className="bg-mist-100 section-py">
      <div className="mx-auto max-w-8xl container-px">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Featured inventory"
            title="This week’s handpicked arrivals"
            description="A curated selection from our showroom floor — each one inspected, documented and ready to drive home."
            className="max-w-xl"
          />
          <Reveal delay={0.1}>
            <Button to="/inventory" variant="outline" iconRight={ArrowRight} className="shrink-0">
              View Full Inventory
            </Button>
          </Reveal>
        </div>

        <div className="mt-12">
          <VehicleGrid cars={cars || []} loading={loading} skeletonCount={6} />
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Button to="/inventory" size="lg" variant="dark" iconRight={ArrowRight}>
            Explore All Vehicles
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
