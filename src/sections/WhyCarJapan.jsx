import { ShieldCheck, FileCheck2, HandCoins, Headset, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHY_US, STATS } from '../data/content';

const ICONS = { ShieldCheck, FileCheck2, HandCoins, Headset };
import SectionHeading from '../components/ui/SectionHeading';
import StatsCard from '../components/StatsCard';
import Image from '../components/ui/Image';
import { RevealGroup, revealItem } from '../components/ui/Reveal';

const WHY_IMAGE =
  'https://images.unsplash.com/photo-1552960562-daf630e9278b?auto=format&fit=crop&w=1200&q=80';

export default function WhyCarJapan() {
  return (
    <section className="mx-auto max-w-8xl container-px section-py">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[32px] shadow-card"
          >
            <Image src={WHY_IMAGE} alt="Car Japan showroom team" className="aspect-[4/5] w-full lg:aspect-[5/6]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute -bottom-8 -right-2 rounded-3xl border border-ink-100 bg-white p-6 shadow-elevated sm:-right-8 sm:p-7"
          >
            <p className="font-display text-4xl font-extrabold text-ink">16+</p>
            <p className="mt-1 max-w-[9rem] text-sm font-medium text-ink-500">
              Years earning Pakistan’s trust
            </p>
          </motion.div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Why Car Japan"
            title="The trusted way to buy a quality used car."
            description="We built Car Japan to remove the anxiety from car buying. Every vehicle is inspected, documented and fairly priced — so you can decide with total confidence."
          />

          <RevealGroup className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {WHY_US.map((item) => {
              const Icon = ICONS[item.icon] || CheckCircle2;
              return (
                <motion.div key={item.title} variants={revealItem} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand">
                    <Icon className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-500">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </RevealGroup>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-8 border-t border-ink-100 pt-12 lg:grid-cols-4">
        {STATS.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
