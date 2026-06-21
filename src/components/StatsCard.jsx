import useCountUp from '../hooks/useCountUp';
import { cn } from '../lib/format';

/** Animated statistic that counts up when scrolled into view. */
export default function StatsCard({ value, suffix = '', label, light = false }) {
  const [count, ref] = useCountUp(value);

  return (
    <div ref={ref} className="text-center sm:text-left">
      <p
        className={cn(
          'font-display text-4xl font-extrabold tracking-tight sm:text-5xl',
          light ? 'text-white' : 'text-ink'
        )}
      >
        {count.toLocaleString('en-US')}
        <span className="text-brand">{suffix}</span>
      </p>
      <p className={cn('mt-1.5 text-sm font-medium', light ? 'text-white/60' : 'text-ink-400')}>
        {label}
      </p>
    </div>
  );
}
