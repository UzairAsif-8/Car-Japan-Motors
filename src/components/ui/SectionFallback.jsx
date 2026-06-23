import { Skeleton } from './Skeleton';

/** Lightweight placeholder while a lazy homepage section chunk loads. */
export default function SectionFallback({ className = 'section-py' }) {
  return (
    <div className={className} aria-hidden>
      <div className="mx-auto max-w-8xl container-px">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-3 h-12 w-full max-w-xl" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
