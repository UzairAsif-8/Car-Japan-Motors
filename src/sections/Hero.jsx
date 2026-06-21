import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { ShieldCheck, Star, BadgeCheck, FileCheck2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Image from '../components/ui/Image';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=2000&q=80';

const trust = [
  { icon: ShieldCheck, label: '150-Point Inspection' },
  { icon: BadgeCheck, label: 'Verified History' },
  { icon: Star, label: '4.9 / 5 Customer Rating' },
];

const TYPEWRITER_STRINGS = ['Car Japan Motors', 'The Name of Trust'];

const WARRANTY_POINTS = [
  { icon: ShieldCheck, text: '1 month engine & suspension warranty' },
  { icon: FileCheck2, text: 'Documents warranty till registration' },
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

      <div className="relative mx-auto w-full max-w-8xl pb-12 pt-36 container-px sm:pb-16 sm:pt-44">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Premium Japanese Vehicles · Since 2015
          </motion.span>

          <h1 className="mt-6 min-h-[1.2em] display-1 text-balance">
            <Typewriter
              options={{
                strings: TYPEWRITER_STRINGS,
                autoStart: true,
                loop: true,
                delay: 48,
                deleteSpeed: 32,
                pauseFor: 2200,
                cursor: '|',
                wrapperClassName: 'hero-headline',
                cursorClassName: 'hero-headline-cursor',
              }}
            />
          </h1>

          <p className="mt-4 text-[clamp(1.35rem,3.2vw,2.25rem)] font-semibold tracking-[0.06em] text-[#FFB3BE]">
            Since 2015
          </p>

          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-5 flex flex-col gap-2.5 sm:gap-3"
          >
            {WARRANTY_POINTS.map((item, i) => (
              <motion.li
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.48 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex w-fit max-w-full items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md sm:px-4 sm:py-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/20 text-brand-300 sm:h-9 sm:w-9">
                  <item.icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-sm font-semibold leading-snug text-white sm:text-[0.95rem]">
                  {item.text}
                </span>
              </motion.li>
            ))}
          </motion.ul>
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
