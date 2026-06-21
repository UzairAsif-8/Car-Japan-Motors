import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import { CONTACT, HOURS, buildWhatsAppLink } from '../constants';

const cards = [
  { icon: Phone, label: 'Call us', value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: MessageCircle, label: 'WhatsApp', value: CONTACT.whatsapp, href: buildWhatsAppLink(), external: true },
  { icon: Mail, label: 'Email', value: CONTACT.email, href: CONTACT.emailHref },
  {
    icon: MapPin,
    label: 'Visit',
    value: `${CONTACT.address.line1}, ${CONTACT.address.line2}`,
    href: CONTACT.mapLink,
    external: true,
  },
];

export default function Contact() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk cars"
        description="Have a question about a vehicle, financing or a trade-in? Reach out however suits you — we’re quick to respond."
      />

      <section className="mx-auto max-w-8xl container-px py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="group flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <c.icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">{c.label}</p>
                <p className="mt-1 font-semibold text-ink">{c.value}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-8xl container-px pb-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Direct contact — WhatsApp / Call, with email for manual reach-out */}
          <Reveal>
            <div className="flex h-full flex-col rounded-[32px] border border-ink-100 bg-white p-7 shadow-card sm:p-10">
              <h2 className="font-display text-2xl font-bold text-ink">Talk to us directly</h2>
              <p className="mt-1.5 text-ink-500">
                The quickest way to reach us — send a WhatsApp message or give us a call and
                we’ll respond right away.
              </p>

              <div className="mt-8 space-y-4">
                <Button
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  size="lg"
                  fullWidth
                  icon={MessageCircle}
                >
                  Chat on WhatsApp
                </Button>
                <Button
                  href={CONTACT.phoneHref}
                  variant="dark"
                  size="lg"
                  fullWidth
                  icon={Phone}
                >
                  Call {CONTACT.phone}
                </Button>
              </div>

              <div className="mt-auto border-t border-ink-100 pt-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Prefer email?
                </p>
                <a
                  href={CONTACT.emailHref}
                  className="mt-2 inline-flex items-center gap-2.5 font-semibold text-ink transition-colors hover:text-brand"
                >
                  <Mail className="h-5 w-5 text-brand" strokeWidth={1.8} />
                  {CONTACT.email}
                </a>
                <p className="mt-2 text-sm text-ink-400">
                  Drop us a line anytime and we’ll get back to you within one business day.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Map + hours */}
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-[32px] border border-ink-100 shadow-card">
              <iframe
                title="Car Japan location"
                src={CONTACT.mapEmbed}
                className="h-72 w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-[32px] border border-ink-100 bg-mist-100 p-8">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-brand" />
                <h3 className="font-display text-lg font-bold text-ink">Showroom hours</h3>
              </div>
              <ul className="mt-5 divide-y divide-ink-100">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-3 text-[15px]">
                    <span className="font-medium text-ink-700">{h.day}</span>
                    <span className="text-ink-500">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
