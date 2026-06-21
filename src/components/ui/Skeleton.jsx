import { cn } from '../../lib/format';

/** Shimmering placeholder block. */
export function Skeleton({ className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-mist-300', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/** Card-shaped skeleton matching the VehicleCard footprint. */
export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function VehicleGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
