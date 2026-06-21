import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews } from '../services/reviewService';
import useAsync from '../hooks/useAsync';
import SectionHeading from '../components/ui/SectionHeading';
import Image from '../components/ui/Image';
import { cn } from '../lib/format';

export default function Testimonials() {
  const { data, loading } = useAsync(() => getReviews(), []);
  const reviews = data || [];
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const paginate = useCallback(
    (d) => {
      if (count === 0) return;
      setDir(d);
      setIndex((i) => (i + d + count) % count);
    },
    [count]
  );

  // Keep the active index valid if the underlying list size changes.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (count <= 1) return undefined;
    const id = setInterval(() => paginate(1), 6000);
    return () => clearInterval(id);
  }, [paginate, count]);

  if (!loading && count === 0) return null;

  const active = reviews[index] || reviews[0];

  return (
    <section className="mx-auto max-w-8xl container-px section-py">
      <SectionHeading
        eyebrow="Customer stories"
        title="Trusted by thousands of Pakistani drivers"
        description="Real words from real owners. The relationships we build matter more than any single sale."
        align="center"
        className="mx-auto"
      />

      <div className="relative mx-auto mt-14 max-w-3xl">
        <Quote className="absolute -top-6 left-1/2 h-16 w-16 -translate-x-1/2 text-brand/10" />
        <div className="relative min-h-[300px] overflow-hidden rounded-[32px] border border-ink-100 bg-white p-8 shadow-card sm:p-12">
          {loading || !active ? (
            <div className="flex animate-pulse flex-col items-center gap-5 py-6">
              <div className="h-5 w-28 rounded-full bg-mist-300" />
              <div className="h-6 w-full max-w-xl rounded-full bg-mist-300" />
              <div className="h-6 w-3/4 rounded-full bg-mist-300" />
              <div className="mt-4 h-12 w-44 rounded-2xl bg-mist-300" />
            </div>
          ) : (
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={active.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex gap-1">
                  {Array.from({ length: active.rating || 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-6 max-w-2xl font-display text-xl font-semibold leading-relaxed text-ink text-balance sm:text-2xl">
                  “{active.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  {active.avatar ? (
                    <Image
                      src={active.avatar}
                      alt={active.name}
                      className="h-12 w-12 rounded-full"
                      imgClassName="rounded-full"
                    />
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-100 font-display text-lg font-bold text-ink-600">
                      {(active.name || '?')[0]}
                    </span>
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-ink">{active.name}</p>
                    <p className="text-sm text-ink-400">{active.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          )}
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <NavBtn onClick={() => paginate(-1)} label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </NavBtn>
            <div className="flex max-w-[60vw] flex-wrap justify-center gap-2">
              {reviews.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === index ? 'w-7 bg-brand' : 'w-2 bg-ink-200 hover:bg-ink-300'
                  )}
                />
              ))}
            </div>
            <NavBtn onClick={() => paginate(1)} label="Next">
              <ChevronRight className="h-5 w-5" />
            </NavBtn>
          </div>
        )}
      </div>
    </section>
  );
}

function NavBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 bg-white text-ink transition-all duration-300 hover:border-ink-900 hover:bg-ink hover:text-white"
    >
      {children}
    </button>
  );
}
