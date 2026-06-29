import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { NAV_LINKS, CONTACT, buildWhatsAppLink } from '../constants';
import Logo from './ui/Logo';
import Button from './ui/Button';
import Drawer from './ui/Drawer';
import { WhatsAppIcon } from './icons/BrandSocialIcons';
import { cn } from '../lib/format';

const LEFT_LINKS = NAV_LINKS.slice(0, 2);
const RIGHT_LINKS = NAV_LINKS.slice(2);

/** Compact nav row — logo overflows but stays vertically centered. */
const ROW = 'h-16 lg:h-20';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="relative mx-auto max-w-7xl overflow-visible rounded-2xl border border-ink-100/80 bg-white px-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] sm:rounded-3xl sm:px-6">
          {/* Desktop */}
          <div className={cn('relative hidden overflow-visible md:block', ROW)}>
            <nav className="absolute inset-y-0 left-0 z-10 flex items-center gap-0.5">
              {LEFT_LINKS.map((link) => (
                <NavItem key={link.to} link={link} />
              ))}
            </nav>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible">
              <div className="pointer-events-auto translate-y-1.5 sm:translate-y-2">
                <Logo size="nav" />
              </div>
            </div>

            <div className="absolute inset-y-0 right-0 z-10 flex items-center gap-2 lg:gap-3">
              <nav className="flex items-center gap-0.5">
                {RIGHT_LINKS.map((link) => (
                  <NavItem key={link.to} link={link} />
                ))}
              </nav>

              <span aria-hidden className="mx-0.5 hidden h-6 w-px shrink-0 bg-ink-100 lg:block" />

              <div className="flex items-center gap-2">
                <NavActionBtn href={CONTACT.phoneHref} label="Call us" icon={Phone} variant="phone" />
                <NavActionBtn
                  href={buildWhatsAppLink()}
                  label="Chat on WhatsApp"
                  icon={WhatsAppIcon}
                  external
                  variant="whatsapp"
                />
                <Button
                  to="/inventory"
                  variant="dark"
                  size="sm"
                  iconRight={ArrowRight}
                  className="hidden lg:inline-flex"
                >
                  Browse
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className={cn('relative overflow-visible md:hidden', ROW)}>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="absolute inset-y-0 left-0 z-10 my-auto grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors duration-300 hover:bg-ink-50 focus-ring"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible">
              <div className="pointer-events-auto translate-y-1.5 sm:translate-y-2">
                <Logo size="nav" />
              </div>
            </div>

            <div className="absolute inset-y-0 right-0 z-10 flex items-center gap-2 pr-0.5">
              <NavActionBtn
                href={buildWhatsAppLink()}
                label="Chat on WhatsApp"
                icon={WhatsAppIcon}
                external
                variant="whatsapp"
                size="sm"
              />
              <NavActionBtn href={CONTACT.phoneHref} label="Call us" icon={Phone} variant="phone" size="sm" />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function NavItem({ link }) {
  return (
    <NavLink
      to={link.to}
      end={link.to === '/'}
      className={({ isActive }) =>
        cn(
          'inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium text-ink-500 transition-colors duration-300 hover:bg-ink-50 hover:text-ink',
          isActive && 'bg-ink-50 font-semibold text-ink'
        )
      }
    >
      {link.label}
    </NavLink>
  );
}

const ACTION_VARIANTS = {
  phone: {
    btn: 'bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white shadow-[0_8px_22px_-6px_rgba(37,99,235,0.55)] ring-2 ring-sky-100/90 hover:from-sky-500 hover:to-blue-700 hover:shadow-[0_12px_28px_-4px_rgba(37,99,235,0.62)]',
    icon: 'h-[19px] w-[19px]',
    stroke: 2.4,
  },
  whatsapp: {
    btn: 'bg-gradient-to-br from-[#25D366] via-[#20bd5a] to-[#128C7E] text-white shadow-[0_8px_22px_-6px_rgba(37,211,102,0.52)] ring-2 ring-emerald-100/90 hover:from-[#2ee06f] hover:to-[#0f7a5c] hover:shadow-[0_12px_28px_-4px_rgba(37,211,102,0.62)]',
    icon: 'h-5 w-5',
    pulse: true,
  },
};

function NavActionBtn({ href, label, icon: Icon, external, variant, size = 'md' }) {
  const config = ACTION_VARIANTS[variant];
  if (!config) return null;

  const dimensions = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11';

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={label}
      title={label}
      className={cn(
        'group relative grid shrink-0 place-items-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus-ring',
        dimensions,
        config.btn
      )}
    >
      {config.pulse && (
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366]/30 opacity-75 group-hover:opacity-0" />
      )}
      <Icon
        className={cn('relative z-[1]', config.icon)}
        {...(config.stroke ? { strokeWidth: config.stroke } : {})}
      />
    </a>
  );
}

function MobileMenu({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" width="max-w-[88vw] sm:max-w-sm">
      <div className="flex h-full flex-col">
        <div className="flex justify-center border-b border-ink-100 bg-white py-8">
          <Logo size="footer" />
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link, i) => (
            <AnimatePresence key={link.to}>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-semibold transition-all duration-300',
                      isActive
                        ? 'bg-ink text-white shadow-lg shadow-ink/20'
                        : 'text-ink-600 hover:bg-ink-50'
                    )
                  }
                >
                  {link.label}
                  <ArrowRight className="h-5 w-5 opacity-40" />
                </NavLink>
              </motion.div>
            </AnimatePresence>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-ink-100 p-5">
          <Button to="/inventory" onClick={onClose} variant="dark" fullWidth iconRight={ArrowRight}>
            Browse Inventory
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button href={CONTACT.phoneHref} variant="outline" icon={Phone} fullWidth>
              Call
            </Button>
            <Button
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              variant="whatsapp"
              icon={MessageCircle}
              fullWidth
            >
              WhatsApp
            </Button>
          </div>
          <p className="pt-2 text-center text-sm text-ink-400">
            {CONTACT.address.line1}, {CONTACT.address.line2}
          </p>
        </div>
      </div>
    </Drawer>
  );
}
