import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { buildWhatsAppLink, CONTACT, SOCIAL } from '../constants';
import { InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon, WhatsAppIcon } from './icons/BrandSocialIcons';
import { cn } from '../lib/format';

const SOCIAL_BUTTONS = [
  {
    key: 'facebook',
    href: SOCIAL.facebook,
    label: 'Follow us on Facebook',
    className: 'bg-[#1877F2] shadow-[0_12px_32px_-8px_rgba(24,119,242,0.55)]',
    Icon: FacebookIcon,
    delay: 0.45,
  },
  {
    key: 'instagram',
    href: SOCIAL.instagram,
    label: 'Follow us on Instagram',
    className:
      'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-[0_12px_32px_-8px_rgba(238,42,123,0.55)]',
    Icon: InstagramIcon,
    delay: 0.5,
  },
  {
    key: 'tiktok',
    href: SOCIAL.tiktok,
    label: 'Follow us on TikTok',
    className: 'bg-black shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)]',
    Icon: TikTokIcon,
    delay: 0.6,
  },
  {
    key: 'youtube',
    href: SOCIAL.youtube,
    label: 'Subscribe on YouTube',
    className: 'bg-[#FF0000] shadow-[0_12px_32px_-8px_rgba(255,0,0,0.5)]',
    Icon: YouTubeIcon,
    delay: 0.7,
  },
];

/** Floating social + WhatsApp buttons fixed to the bottom-right corner. */
export default function FloatingSocial() {
  const [hint, setHint] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {SOCIAL_BUTTONS.map(({ key, href, label, className, Icon, delay }) => (
        <FloatingButton
          key={key}
          href={href}
          label={label}
          className={className}
          delay={delay}
        >
          <Icon className="h-7 w-7" />
        </FloatingButton>
      ))}

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.9 }}
              transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 22 }}
              className="relative hidden rounded-2xl bg-white px-4 py-2.5 pr-9 text-sm font-semibold text-ink shadow-card sm:block"
            >
              Questions? Chat with us
              <button
                type="button"
                onClick={() => setHint(false)}
                aria-label="Dismiss"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingButton
          href={buildWhatsAppLink(`Hi Car Japan, I'm browsing your inventory and have a question.`)}
          label={`Chat on WhatsApp ${CONTACT.whatsapp}`}
          className="bg-[#1faf54] shadow-[0_12px_32px_-8px_rgba(31,175,84,0.65)]"
          delay={0.8}
          pulse
        >
          <WhatsAppIcon className="h-7 w-7" />
        </FloatingButton>
      </div>
    </div>
  );
}

function FloatingButton({ href, label, className, delay, pulse, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        'relative grid h-14 w-14 place-items-center rounded-full text-white',
        className
      )}
    >
      {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-[#1faf54] opacity-20" />}
      {children}
    </motion.a>
  );
}
