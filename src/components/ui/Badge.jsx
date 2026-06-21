import { cn } from '../../lib/format';

const TONES = {
  neutral: 'bg-ink-50 text-ink-600 border-ink-100',
  brand: 'bg-brand-50 text-brand-600 border-brand-100',
  dark: 'bg-ink text-white border-ink',
  light: 'bg-white/85 text-ink border-white/60 backdrop-blur',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function Badge({ tone = 'neutral', icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight',
        TONES[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />}
      {children}
    </span>
  );
}
