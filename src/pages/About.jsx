import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/ui/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import StatsCard from '../components/StatsCard';
import CTASection from '../components/CTASection';
import Image from '../components/ui/Image';
import Reveal, { RevealGroup, revealItem } from '../components/ui/Reveal';
import { VALUES, TIMELINE, STATS } from '../data/content';
import { BRAND } from '../constants';

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1567769541495-15a8c9a86df7?auto=format&fit=crop&w=1400&q=80';

export default function About() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Our story"
        title="Honest cars, sold the way they should be."
        description={`Since ${BRAND.established}, Car Japan has helped thousands of Pakistani families buy with total confidence. No pressure, no surprises — just genuinely good cars and people who care.`}
      />

      {/* Intro split */}
      <section className="mx-auto max-w-8xl container-px section-py">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[32px] shadow-card">
              <Image src={ABOUT_IMAGE} alt="Inside the Car Japan showroom" className="aspect-[4/3] w-full" />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="A dealership built on relationships, not transactions."
              description="We started Car Japan with a frustration shared by every car buyer in Pakistan — the uncertainty. Hidden histories, inflated prices, and pressure to decide. We decided to build the opposite."
            />
            <Reveal delay={0.15}>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-500">
                Today, every vehicle on our floor is inspected against a 150-point standard,
                documented transparently, and priced fairly. The result is a calmer, more
                dignified way to buy a car — and customers who keep coming back.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-mist-100 section-py">
        <div className="mx-auto grid max-w-8xl gap-6 container-px lg:grid-cols-2">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              body: 'To make buying a quality used car the most trustworthy, transparent and pleasant experience in Pakistan — one honest handshake at a time.',
            },
            {
              icon: Eye,
              title: 'Our Vision',
              body: 'To become the name Pakistanis think of first when they imagine a dealership they can genuinely trust, for generations.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="h-full rounded-3xl border border-ink-100 bg-white p-9 shadow-soft">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white">
                  <item.icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-8xl container-px section-py">
        <SectionHeading
          eyebrow="What we stand for"
          title="The values behind every sale"
          align="center"
          className="mx-auto"
        />
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              variants={revealItem}
              className="rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-soft"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{v.description}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {/* Timeline */}
      <section className="bg-mist-100 section-py">
        <div className="mx-auto max-w-4xl container-px">
          <SectionHeading
            eyebrow="Our journey"
            title="Sixteen years in the making"
            align="center"
            className="mx-auto"
          />
          <div className="relative mt-14 space-y-10">
            <div className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-ink-200 sm:block" />
            {TIMELINE.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.08}>
                <div className="relative flex gap-6">
                  <div className="hidden shrink-0 sm:block">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand font-display text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(216,30,44,0.6)]">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex-1 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
                    <span className="font-display text-sm font-bold text-brand sm:hidden">{item.year}</span>
                    <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-500">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-8xl container-px py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatsCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Come say hello"
        title="The best way to know us is to visit."
        description="Drop by our Lahore showroom for a coffee and an honest conversation about your next car."
      />
    </PageTransition>
  );
}
