import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { CONTACT, HOURS } from '../constants';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import LocationGlobe from '../components/globe/LocationGlobe';

export default function Showroom() {
  return (
    <section className="bg-white section-py">
      <div className="mx-auto max-w-8xl container-px">
        <SectionHeading
          eyebrow="Visit us"
          title="One showroom. Endless attention to detail."
          description="Step into our Gulberg flagship — a calm, unhurried space designed for one thing: helping you find the right car."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="h-full">
            <LocationGlobe className="h-full" />
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-ink-100 shadow-card">
              <iframe
                title="Car Japan location"
                src={CONTACT.mapEmbed}
                className="h-56 w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-1 flex-col rounded-3xl border border-ink-100 bg-white p-8 shadow-card sm:p-9">
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                Car Japan — Lahore
              </h3>
              <ul className="mt-7 space-y-6 text-[15px]">
                <InfoRow icon={MapPin}>
                  {CONTACT.address.line1}, {CONTACT.address.line2}
                </InfoRow>
                <InfoRow icon={Phone}>{CONTACT.phone}</InfoRow>
                <InfoRow icon={Clock}>
                  <span className="block space-y-1.5">
                    {HOURS.map((h) => (
                      <span key={h.day} className="block leading-relaxed text-ink-500">
                        <span className="font-medium text-ink-700">{h.day}:</span> {h.time}
                      </span>
                    ))}
                  </span>
                </InfoRow>
              </ul>
              <div className="mt-8 border-t border-ink-100 pt-7">
                <Button
                  href={CONTACT.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  variant="dark"
                  icon={Navigation}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, children }) {
  return (
    <li className="flex gap-3.5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
      <div className="leading-relaxed text-ink-600">{children}</div>
    </li>
  );
}
