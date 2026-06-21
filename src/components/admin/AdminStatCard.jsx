import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/format';

/** Dashboard statistic card with icon, value and optional trend. */
export default function AdminStatCard({ icon: Icon, label, value, trend, accent = 'brand', index = 0 }) {
  const accents = {
    brand: 'bg-brand-50 text-brand',
    ink: 'bg-ink-100 text-ink-700',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
    >
      <div className="flex items-start justify-between">
        <span className={cn('grid h-11 w-11 place-items-center rounded-xl', accents[accent])}>
          <Icon className="h-[22px] w-[22px]" strokeWidth={1.9} />
        </span>
        {trend && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-400">{label}</p>
    </motion.div>
  );
}
