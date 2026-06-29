import { SearchX } from 'lucide-react';
import VehicleCard from './VehicleCard';
import VehicleFetchError from './VehicleFetchError';
import { VehicleGridSkeleton } from './ui/Skeleton';
import Button from './ui/Button';
import { cn } from '../lib/format';

/** Responsive vehicle grid/list with loading, error, and empty states. */
export default function VehicleGrid({
  cars = [],
  loading = false,
  error = null,
  isRetrying = false,
  onRetry,
  layout = 'grid',
  skeletonCount = 6,
  onReset,
  emptyMessage = 'No vehicles match your search',
  emptyDescription = 'Try adjusting your filters or clearing them to explore the full inventory.',
}) {
  if (loading) {
    return (
      <div>
        {isRetrying && (
          <p className="mb-4 text-center text-sm font-medium text-ink-500">
            Waking up the server… this may take a moment.
          </p>
        )}
        <VehicleGridSkeleton count={skeletonCount} />
      </div>
    );
  }

  if (error) {
    return <VehicleFetchError onRetry={onRetry} retrying={isRetrying} />;
  }

  if (!cars.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-mist-100 px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-ink-300 shadow-soft">
          <SearchX className="h-8 w-8" strokeWidth={1.5} />
        </span>
        <h3 className="mt-6 font-display text-xl font-bold text-ink">{emptyMessage}</h3>
        <p className="mt-2 max-w-sm text-ink-500">{emptyDescription}</p>
        {onReset && (
          <Button onClick={onReset} variant="outline" size="sm" className="mt-6">
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        layout === 'list'
          ? 'flex flex-col gap-6'
          : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
      )}
    >
      {cars.map((car, i) => (
        <VehicleCard key={car._id} car={car} index={i} layout={layout} />
      ))}
    </div>
  );
}
