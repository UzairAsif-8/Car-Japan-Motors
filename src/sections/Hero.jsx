import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck, Star, BadgeCheck } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Image from '../components/ui/Image';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=2000&q=80';

const trust = [
  { icon: ShieldCheck, label: '150-Point Inspection' },
  { icon: BadgeCheck, label: 'Verified History' },
  { icon: Star, label: '4.9 / 5 Customer Rating' },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <Image src={HERO_IMAGE} alt="Premium vehicle at Car Japan showroom" className="h-full w-full" />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/45 to-ink-900/30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-8xl pb-12 pt-32 container-px sm:pb-16">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Premium Japanese Vehicles · Since 2009
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 display-1 text-white text-balance"
          >
            Find a car you’ll
            <br />
            be proud to own.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl"
          >
            Hand-selected, fully inspected and honestly priced. Discover Pakistan’s
            most trusted collection of Japanese vehicles — all in one place.
          </motion.p>
        </div>

        <SearchBar className="mt-9 max-w-4xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3"
        >
          {trust.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-2 text-sm font-medium text-white/85">
              <t.icon className="h-[18px] w-[18px] text-brand-300" strokeWidth={2} />
              {t.label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
