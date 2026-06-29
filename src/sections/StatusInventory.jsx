import { ArrowRight } from 'lucide-react';
import useVehicles from '../hooks/useVehicles';
import VehicleGrid from '../components/VehicleGrid';
import VehicleFetchError from '../components/VehicleFetchError';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';

/**
 * Reusable home-page inventory section. Hides itself when empty after a successful load.
 */
export default function StatusInventory({
  eyebrow,
  title,
  description,
  fetcher,
  viewAllTo = '/inventory',
  viewAllLabel = 'View Full Inventory',
  showViewAll = true,
  className = 'bg-mist-100 section-py',
  limit,
}) {
  const { data: cars, loading, error, isRetrying, refetch } = useVehicles(fetcher, []);

  const list = cars == null ? [] : limit ? cars.slice(0, limit) : cars;

  if (loading) {
    return (
      <section className={className}>
        <div className="mx-auto max-w-8xl container-px">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} className="max-w-xl" />
          <div className="mt-12">
            <VehicleGrid cars={[]} loading isRetrying={isRetrying} skeletonCount={6} />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={className}>
        <div className="mx-auto max-w-8xl container-px">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} className="max-w-xl" />
          <div className="mt-12">
            <VehicleFetchError onRetry={refetch} retrying={isRetrying} compact />
          </div>
        </div>
      </section>
    );
  }

  if (list.length === 0) return null;

  return (
    <section className={className}>
      <div className="mx-auto max-w-8xl container-px">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="max-w-xl"
          />
          {showViewAll && (
            <Reveal delay={0.1}>
              <Button to={viewAllTo} variant="outline" iconRight={ArrowRight} className="shrink-0">
                {viewAllLabel}
              </Button>
            </Reveal>
          )}
        </div>

        <div className="mt-12">
          <VehicleGrid cars={list} loading={false} skeletonCount={6} />
        </div>
      </div>
    </section>
  );
}
