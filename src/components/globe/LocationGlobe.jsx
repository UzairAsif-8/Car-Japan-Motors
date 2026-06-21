import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { MapPin, Hand } from 'lucide-react';
import { CONTACT } from '../../constants';
import { cn } from '../../lib/format';
import GlobeFallback from './GlobeFallback';

// The cobe globe is split into its own chunk and only fetched when this
// section scrolls into view (and the device can handle WebGL).
const CobeGlobe = lazy(() => import('./CobeGlobe'));

/** Best-effort WebGL capability check. */
function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Premium interactive globe that marks the showroom location.
 * Drop-in replacement for the old showroom image collage — same grid cell,
 * same rounded/elevated styling, so the page layout is unchanged.
 */
export default function LocationGlobe({ className }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [canRender3D, setCanRender3D] = useState(false);

  // Decide once whether this device should run the WebGL globe.
  useEffect(() => {
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lowPower =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 2);

    setReduced(reducedMq.matches);
    setCanRender3D(supportsWebGL() && !reducedMq.matches && !lowPower);

    const onChange = (e) => {
      setReduced(e.matches);
      setCanRender3D(supportsWebGL() && !e.matches && !lowPower);
    };
    reducedMq.addEventListener?.('change', onChange);
    return () => reducedMq.removeEventListener?.('change', onChange);
  }, []);

  // Lazy-mount only when the section approaches the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3D = canRender3D && inView;

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-full min-h-[440px] overflow-hidden lg:min-h-0',
        className
      )}
    >
      {show3D ? (
        <Suspense fallback={<GlobeFallback animated />}>
          <CobeGlobe />
        </Suspense>
      ) : (
        <GlobeFallback animated={!reduced} />
      )}

      {/* Location chip (top-left) */}
      <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-ink-100 bg-white/70 px-3.5 py-1.5 backdrop-blur-md">
        <MapPin className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
        <span className="text-[12px] font-semibold tracking-wide text-ink-700">
          {CONTACT.address.city}, {CONTACT.address.country}
        </span>
      </div>

      {/* Coordinates (bottom-left) */}
      <div className="pointer-events-none absolute bottom-5 left-5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-400">
        {CONTACT.coordinates.lat.toFixed(4)}°N · {CONTACT.coordinates.lng.toFixed(4)}°E
      </div>

      {/* Interaction hint (bottom-right) — only when the globe is interactive */}
      {show3D && (
        <div className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-1.5 text-[11px] font-medium text-ink-400">
          <Hand className="h-3.5 w-3.5" strokeWidth={1.8} />
          Drag to explore
        </div>
      )}
    </div>
  );
}
