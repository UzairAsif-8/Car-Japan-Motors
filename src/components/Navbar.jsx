import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import useScrollPosition from '../hooks/useScrollPosition';
import { NAV_LINKS, CONTACT, buildWhatsAppLink } from '../constants';
import Logo from './ui/Logo';
import Button from './ui/Button';
import Drawer from './ui/Drawer';
import { cn } from '../lib/format';

export default function Navbar() {
  const { scrolled } = useScrollPosition(40);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // The home hero is dark imagery, so the nav starts transparent/light there.
  const overHero = pathname === '/' && !scrolled;
  const solid = !overHero;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth',
          solid
            ? 'glass-nav border-b border-ink-100/70 bg-white/85 py-3'
            : 'border-b border-transparent bg-transparent py-5'
        )}
      >
        <div className="mx-auto flex max-w-8xl items-center justify-between container-px">
          <Logo light={overHero} />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300',
                    overHero
                      ? 'text-white/80 hover:text-white'
                      : 'text-ink-600 hover:text-ink',
                    isActive && (overHero ? 'text-white' : 'text-ink')
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className={cn(
                          'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full',
                          overHero ? 'bg-white' : 'bg-brand'
                        )}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={CONTACT.phoneHref}
              className={cn(
                'hidden h-11 w-11 place-items-center rounded-full transition-colors duration-300 xl:grid focus-ring',
                overHero
                  ? 'text-white/85 hover:bg-white/10'
                  : 'text-ink-600 hover:bg-ink-50'
              )}
              aria-label="Call us"
            >
              <Phone className="h-[18px] w-[18px]" />
            </a>
            <Button
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              variant={overHero ? 'light' : 'outline'}
              size="sm"
              icon={MessageCircle}
              className="hidden sm:inline-flex"
            >
              WhatsApp
            </Button>
            <Button
              to="/inventory"
              variant={overHero ? 'light' : 'dark'}
              size="sm"
              iconRight={ArrowRight}
              className="hidden sm:inline-flex"
            >
              Browse Inventory
            </Button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={cn(
                'grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 lg:hidden focus-ring',
                overHero ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink-50'
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} title="Menu" width="max-w-[88vw] sm:max-w-sm">
      <div className="flex h-full flex-col">
        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link, i) => (
            <AnimatePresence key={link.to}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-2xl px-5 py-4 text-lg font-semibold transition-colors',
                      isActive ? 'bg-ink-50 text-ink' : 'text-ink-600 hover:bg-ink-50'
                    )
                  }
                >
                  {link.label}
                  <ArrowRight className="h-5 w-5 text-ink-300" />
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
