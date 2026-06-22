import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { ShieldCheck, Star, BadgeCheck, FileCheck2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const HERO_CAR = '/Untitled design (1).svg';

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
  return (
    <section className="relative overflow-x-clip bg-[#0a0a0a] md:min-h-[580px] lg:min-h-[660px]">
      {/* Matte black base */}
      <div aria-hidden className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Red diagonal — top-right → bottom center */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <line
          x1="100%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#D81E2C"
          strokeWidth="34"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-8xl pb-[clamp(1.25rem,1.5vw,1.5rem)] pt-[clamp(5.5rem,8vw,8rem)] sm:pb-8 md:pb-10 md:pt-36 lg:pb-14 lg:pt-40 container-px">
        {/* Left column — same 46% band as desktop on all breakpoints */}
        <div className="relative w-full max-w-[46%] min-w-0 overflow-visible">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-[7.5px] font-bold uppercase leading-normal tracking-[0.06em] text-white sm:gap-[clamp(0.35rem,0.5vw,0.5rem)] sm:px-[clamp(0.75rem,1.1vw,1rem)] sm:py-[clamp(0.35rem,0.55vw,0.5rem)] sm:text-[clamp(0.625rem,0.85vw,0.75rem)] sm:leading-none sm:tracking-[0.14em]"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-white sm:h-[clamp(0.3rem,0.45vw,0.375rem)] sm:w-[clamp(0.3rem,0.45vw,0.375rem)]" />
            <span className="whitespace-nowrap">Premium Japanese Vehicles · Since 2015</span>
          </motion.span>

          <div className="mt-[clamp(0.75rem,1.2vw,1rem)] border-b border-white/[0.08] pb-3 text-left md:pb-4">
            <h1 className="min-h-[1.1em] whitespace-nowrap font-display text-[clamp(1rem,5.2vw,5rem)] font-extrabold leading-none tracking-tight text-white">
              <Typewriter
                options={{
                  strings: TYPEWRITER_STRINGS,
                  autoStart: true,
                  loop: true,
                  delay: 48,
                  deleteSpeed: 32,
                  pauseFor: 2200,
                  cursor: '|',
                  wrapperClassName: 'text-white',
                  cursorClassName: 'text-white/70',
                }}
              />
            </h1>

            <p className="mt-1 font-display text-[0.65rem] font-semibold leading-none tracking-tight text-white sm:mt-[clamp(0.5rem,0.65vw,0.625rem)] sm:text-[clamp(1rem,1.5vw,1.25rem)]">
              Since 2015
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-3 md:mt-4"
          >
            <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-300/70 md:mb-2 md:text-[10px]">
              Warranty
            </p>
            <ul className="flex flex-col gap-1 md:gap-2">
            {WARRANTY_POINTS.map((item, i) => (
              <motion.li
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.48 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex w-fit max-w-full items-center gap-1 px-0 py-0.5 md:gap-2.5 md:py-0"
              >
                <span className="grid h-3.5 w-3.5 shrink-0 place-items-center text-brand-300 md:h-6 md:w-6">
                  <item.icon className="h-2.5 w-2.5 md:h-4 md:w-4" strokeWidth={1.75} />
                </span>
                <span className="font-display text-[7.5px] font-medium italic tracking-[0.06em] text-white/85 md:text-sm md:tracking-[0.04em] lg:text-base">
                  {item.text}
                </span>
              </motion.li>
            ))}
            </ul>
          </motion.div>
        </div>

        {/* Search + hero car — same composition on all screen sizes */}
        <div className="relative mt-[clamp(1.25rem,2vw,2rem)] md:mt-12 lg:mt-16">
          <div className="relative max-w-4xl">
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-[14%] z-[11] h-[clamp(1rem,1.25vw,1.5rem)] w-[min(42vw,320px)] rounded-[100%] bg-black/45 blur-xl"
            />

            <SearchBar className="relative z-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 56, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-[calc(50%-50vw)] bottom-[calc(100%-0.75rem)] z-20 w-[min(54vw,600px)] md:bottom-[calc(100%-4rem)]"
          >
            <motion.img
              src={encodeURI(HERO_CAR)}
              alt="Premium vehicle at Car Japan Motors"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="h-auto w-full origin-bottom-right object-contain object-right [-webkit-user-drag:none]"
              style={{
                transform: 'rotate(-11deg)',
                filter:
                  'drop-shadow(0 22px 14px rgba(0,0,0,0.5)) drop-shadow(0 8px 6px rgba(0,0,0,0.35))',
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="relative z-10 mt-[clamp(1rem,1.4vw,1.25rem)] flex max-w-4xl flex-wrap items-center gap-x-[clamp(0.85rem,1.4vw,1.25rem)] gap-y-2 md:mt-8 lg:mt-10"
        >
          {trust.map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-2 text-[clamp(0.75rem,1vw,0.875rem)] font-medium text-white/85"
            >
              <t.icon
                className="h-[clamp(0.9rem,1.2vw,1.125rem)] w-[clamp(0.9rem,1.2vw,1.125rem)] text-brand-300"
                strokeWidth={2}
              />
              {t.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
