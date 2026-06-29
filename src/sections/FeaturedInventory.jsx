import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getCars } from '../services/carService';
import useVehicles from '../hooks/useVehicles';
import VehicleGrid from '../components/VehicleGrid';
import { VEHICLE_EMPTY_MESSAGE } from '../components/VehicleFetchError';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import { CAR_STATUS, INVENTORY_STATUS_FILTERS } from '../constants';
import { cn } from '../lib/format';

const EMPTY_MESSAGES = {
  '': VEHICLE_EMPTY_MESSAGE,
  [CAR_STATUS.AVAILABLE]: 'No available vehicles added currently.',
  [CAR_STATUS.SOLD]: 'No sold vehicles added currently.',
  [CAR_STATUS.UPCOMING]: 'No upcoming vehicles added currently.',
};

const EMPTY_DESCRIPTIONS = {
  '': 'Check back soon — our showroom inventory is updated regularly.',
  [CAR_STATUS.AVAILABLE]: 'Available vehicles will appear here once added.',
  [CAR_STATUS.SOLD]: 'Sold vehicles will appear here once marked as sold.',
  [CAR_STATUS.UPCOMING]: 'Upcoming arrivals will appear here once added.',
};

export default function FeaturedInventory() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: cars, loading, error, isRetrying, refetch } = useVehicles(() => getCars(), []);

  const filtered = useMemo(() => {
    if (!cars) return [];
    if (!statusFilter) return cars;
    return cars.filter((c) => (c.status || CAR_STATUS.AVAILABLE) === statusFilter);
  }, [cars, statusFilter]);

  const emptyMessage = EMPTY_MESSAGES[statusFilter] || EMPTY_MESSAGES[''];
  const emptyDescription = EMPTY_DESCRIPTIONS[statusFilter] || EMPTY_DESCRIPTIONS[''];

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

        <div className="mt-8 flex flex-wrap gap-2">
          {INVENTORY_STATUS_FILTERS.map((f) => (
            <button
              key={f.value || 'all'}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300',
                statusFilter === f.value
                  ? 'border-ink bg-ink text-white shadow-soft'
                  : 'border-ink-100 bg-white text-ink-600 hover:border-ink-300 hover:text-ink'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={statusFilter || 'all'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <VehicleGrid
                cars={filtered}
                loading={loading}
                error={error}
                isRetrying={isRetrying}
                onRetry={refetch}
                skeletonCount={6}
                emptyMessage={emptyMessage}
                emptyDescription={emptyDescription}
              />
            </motion.div>
          </AnimatePresence>
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
