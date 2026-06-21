import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import { BRAND, CONTACT, NAV_LINKS, SOCIAL, HOURS, MAKES, buildWhatsAppLink } from '../constants';
import Logo from './ui/Logo';

const socialIcons = [
  { icon: Facebook, href: SOCIAL.facebook, label: 'Facebook' },
  { icon: Instagram, href: SOCIAL.instagram, label: 'Instagram' },
  { icon: Youtube, href: SOCIAL.youtube, label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-mist-100">
      <div className="mx-auto max-w-8xl container-px py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink-500">
              {BRAND.description} Inspected, transparent, and ready to drive — since {BRAND.established}.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink-100 bg-white text-ink-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900 hover:text-ink"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterCol title="Explore" links={NAV_LINKS.map((l) => ({ label: l.label, to: l.to }))} />
            <FooterCol
              title="Popular Makes"
              links={MAKES.slice(0, 5).map((m) => ({
                label: m,
                to: `/inventory?make=${encodeURIComponent(m)}`,
              }))}
            />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink">Showroom Hours</h4>
              <ul className="mt-5 space-y-3">
                {HOURS.map((h) => (
                  <li key={h.day} className="text-sm">
                    <span className="block font-semibold text-ink-700">{h.day}</span>
                    <span className="text-ink-400">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-ink">Get in touch</h4>
            <ul className="mt-5 space-y-4 text-sm">
              <ContactRow icon={MapPin}>
                {CONTACT.address.line1}
                <br />
                {CONTACT.address.line2}
              </ContactRow>
              <ContactRow icon={Phone} href={CONTACT.phoneHref}>
                {CONTACT.phone}
              </ContactRow>
              <ContactRow icon={Mail} href={CONTACT.emailHref}>
                {CONTACT.email}
              </ContactRow>
              <ContactRow icon={MessageCircle} href={buildWhatsAppLink()} external>
                Chat on WhatsApp
              </ContactRow>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-sm text-ink-400">
              © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
            </p>
            <p className="text-sm text-ink-400">
              Crafted by{' '}
              <a
                href="https://www.axiolinksystems.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink-600 transition-colors hover:text-brand"
              >
                Axiolink Systems (Pvt) Ltd
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-ink-500 transition-colors hover:text-ink">
              Privacy Policy
            </Link>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-ink-400 transition-colors hover:text-ink"
            >
              Admin Login
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider text-ink">{title}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-ink-500 transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({ icon: Icon, href, external, children }) {
  const content = (
    <span className="flex gap-3 text-ink-500">
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" strokeWidth={1.8} />
      <span className="leading-relaxed">{children}</span>
    </span>
  );
  if (href) {
    return (
      <li>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className="transition-colors hover:text-ink"
        >
          {content}
        </a>
      </li>
    );
  }
  return <li>{content}</li>;
}
