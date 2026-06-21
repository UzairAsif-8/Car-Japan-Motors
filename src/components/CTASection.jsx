import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import Button from './ui/Button';
import Reveal from './ui/Reveal';
import { CONTACT, buildWhatsAppLink } from '../constants';

/**
 * Final call-to-action band. Bright by default (per the brand's light system),
 * with a refined charcoal panel rather than a heavy dark section.
 */
export default function CTASection({
  eyebrow = 'Ready when you are',
  title = 'Let’s find the car that fits your life.',
  description = 'Visit our Lahore showroom or start a conversation on WhatsApp. No pressure — just honest advice from people who love cars.',
  primary = { label: 'Browse Inventory', to: '/inventory' },
}) {
  return (
    <section className="mx-auto max-w-8xl container-px py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-[36px] bg-ink-900 px-6 py-16 sm:px-16 sm:py-20">
        {/* subtle texture, not a heavy gradient */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              <span className="h-px w-6 bg-brand-300" />
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {description}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <motion.div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button to={primary.to} size="lg" iconRight={ArrowRight}>
                {primary.label}
              </Button>
              <Button
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="lg"
                icon={MessageCircle}
              >
                WhatsApp Us
              </Button>
              <Button href={CONTACT.phoneHref} variant="light" size="lg" icon={Phone}>
                {CONTACT.phone}
              </Button>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
