import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/format';

/**
 * Horizontal, snap-scrolling carousel with arrow controls. Children are laid
 * out in a flex track; pass widths via the `itemClassName` prop. Works great
 * for similar-vehicle rows and any card strip.
 */
export default function Carousel({ children, className, itemClassName, ariaLabel = 'Carousel' }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setEdges({
      start: scrollLeft <= 4,
      end: scrollLeft + clientWidth >= scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        aria-label={ariaLabel}
      >
        {items.map((child, i) => (
          <div key={i} className={cn('snap-start shrink-0', itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <CarouselButton onClick={() => scrollBy(-1)} disabled={edges.start} label="Previous">
          <ChevronLeft className="h-5 w-5" />
        </CarouselButton>
        <CarouselButton onClick={() => scrollBy(1)} disabled={edges.end} label="Next">
          <ChevronRight className="h-5 w-5" />
        </CarouselButton>
      </div>
    </div>
  );
}

function CarouselButton({ onClick, disabled, label, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full border border-ink-200 bg-white text-ink transition-all duration-300 hover:border-ink-900 hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-200 disabled:hover:bg-white disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}
