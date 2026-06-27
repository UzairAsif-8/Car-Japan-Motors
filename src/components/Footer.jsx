import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { BRAND, CONTACT, NAV_LINKS, SOCIAL, HOURS, MAKES, buildWhatsAppLink } from '../constants';
import Logo from './ui/Logo';
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from './icons/BrandSocialIcons';
import { cn } from '../lib/format';

const socialLinks = [
  {
    key: 'facebook',
    href: SOCIAL.facebook,
    label: 'Follow us on Facebook',
    className: 'bg-[#1877F2] text-white shadow-[0_6px_18px_-6px_rgba(24,119,242,0.55)]',
    Icon: FacebookIcon,
  },
  {
    key: 'instagram',
    href: SOCIAL.instagram,
    label: 'Follow us on Instagram',
    className:
      'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-[0_6px_18px_-6px_rgba(238,42,123,0.45)]',
    Icon: InstagramIcon,
  },
  {
    key: 'tiktok',
    href: SOCIAL.tiktok,
    label: 'Follow us on TikTok',
    className: 'bg-black text-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.35)]',
    Icon: TikTokIcon,
  },
  {
    key: 'youtube',
    href: SOCIAL.youtube,
    label: 'Subscribe on YouTube',
    className: 'bg-[#FF0000] text-white shadow-[0_6px_18px_-6px_rgba(255,0,0,0.45)]',
    Icon: YouTubeIcon,
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-100 bg-mist-100">
      <div className="mx-auto max-w-8xl container-px py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="footer" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink-500">
              {BRAND.description} Inspected, transparent, and ready to drive — since {BRAND.established}.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map(({ key, href, label, className, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(
                    'grid h-11 w-11 place-items-center rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:scale-105',
                    className
                  )}
                >
                  <Icon className="h-5 w-5" />
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

        <div className="mt-14 border-t border-ink-100 pt-8">
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
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

          <div className="mt-6 border-t border-ink-100/80 pt-5">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-brand"
            >
              Admin Login
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/privacy"
              className="mt-3 block text-sm text-ink-500 transition-colors hover:text-ink"
            >
              Privacy Policy
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
