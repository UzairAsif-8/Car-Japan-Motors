import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from '../components/ui/Image';
import Reveal from '../components/ui/Reveal';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=2000&q=80';

/** Apple-style full-bleed storytelling moment with layered parallax. */
export default function FeaturedStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  return (
    <section ref={ref} className="relative flex min-h-[88svh] items-center overflow-hidden bg-ink-900">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image src={STORY_IMAGE} alt="The Land Cruiser story" className="h-full w-full" imgClassName="opacity-80" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/55 to-ink-900/20" />

      <div className="relative mx-auto w-full max-w-8xl container-px py-24">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              <span className="h-px w-6 bg-brand-300" /> The flagship
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">
              Built to go
              <br />
              anywhere. Made
              <br />
              to last decades.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
              The Toyota Land Cruiser is more than a vehicle — it’s a legacy of reliability.
              Every example we sell carries that same uncompromising standard, inspected to the
              smallest detail.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap gap-8">
              {[
                { k: '3.5L', v: 'Twin-Turbo V6' },
                { k: '4WD', v: 'Go-anywhere' },
                { k: '7', v: 'Seats' },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-3xl font-extrabold text-white">{s.k}</p>
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
