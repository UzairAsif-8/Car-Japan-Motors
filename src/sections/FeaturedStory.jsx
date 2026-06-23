import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/ui/Reveal';

// Black Toyota Land Cruiser — Unsplash (Abraham Okolo)
const STORY_IMAGE = '/flagship-land-cruiser.jpg';

/** Flagship Land Cruiser — full-bleed dark background with copy overlay. */
export default function FeaturedStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[min(72svh,720px)] items-center overflow-hidden bg-ink-900 sm:min-h-[min(78svh,780px)]"
    >
      <motion.div style={{ y }} className="absolute inset-0 h-full w-full" aria-hidden>
        <img
          src={STORY_IMAGE}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[78%_center] max-md:object-[62%_center]"
        />
      </motion.div>

      {/* Text-side shade — keeps the right side open so the car stays visible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/45 to-ink-900/5" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-ink-900/20 md:from-ink-900/35" />

      <div className="relative mx-auto w-full max-w-8xl container-px py-16 sm:py-20">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              <span className="h-px w-6 bg-brand-300" /> The flagship
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Built to go
              <br />
              anywhere. Made
              <br />
              to last decades.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              The Toyota Land Cruiser is more than a vehicle — it’s a legacy of reliability.
              Every example we sell carries that same uncompromising standard, inspected to the
              smallest detail.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-6 sm:gap-8">
              {[
                { k: '3.5L', v: 'Twin-Turbo V6' },
                { k: '4WD', v: 'Go-anywhere' },
                { k: '7', v: 'Seats' },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-2xl font-extrabold text-white sm:text-3xl">{s.k}</p>
                  <p className="text-sm text-white/60">{s.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              to="/inventory?make=Land%20Cruiser"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition-all duration-300 hover:gap-3"
            >
              Discover the Land Cruiser
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
