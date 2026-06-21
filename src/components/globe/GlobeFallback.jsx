import { cn } from '../../lib/format';

/**
 * Pure-CSS premium globe used while the WebGL scene loads, and as the permanent
 * lightweight stand-in for reduced-motion / low-performance devices.
 * No Three.js, no canvas — just gradients and a soft marker.
 */
export default function GlobeFallback({ animated = true, label }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      {/* The sphere */}
      <div
        className="relative aspect-square w-[68%] max-w-[360px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 36% 30%, #1b2740 0%, #0d1422 45%, #070b13 100%)',
          boxShadow:
            '0 0 80px 8px rgba(63,110,165,0.18), inset -22px -22px 60px rgba(0,0,0,0.65), inset 14px 14px 50px rgba(90,125,166,0.18)',
        }}
      >
        {/* Atmospheric ring */}
        <div
          className="pointer-events-none absolute -inset-3 rounded-full"
          style={{ boxShadow: '0 0 60px 6px rgba(80,120,170,0.22)' }}
        />
        {/* Faint meridian/parallel hint */}
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent 0 22px, rgba(80,120,170,0.10) 22px 23px), repeating-linear-gradient(90deg, transparent 0 22px, rgba(80,120,170,0.08) 22px 23px)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 60%, transparent 75%)',
            maskImage: 'radial-gradient(circle at 50% 50%, #000 60%, transparent 75%)',
          }}
        />
        {/* Showroom marker (upper-right ≈ northern hemisphere) */}
        <span className="absolute left-[60%] top-[34%]">
          <span
            className={cn(
              'block h-2.5 w-2.5 rounded-full bg-brand',
              animated && 'animate-pulse'
            )}
            style={{ boxShadow: '0 0 14px 4px rgba(216,30,44,0.65)' }}
          />
        </span>
      </div>

      {label && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          {label}
        </span>
      )}
    </div>
  );
}
