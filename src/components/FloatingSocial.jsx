import { motion } from 'framer-motion';
import { SOCIAL } from '../constants';
import { InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon } from './icons/BrandSocialIcons';
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

/** Floating social buttons fixed to the bottom-right corner. */
export default function FloatingSocial() {
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
    </div>
  );
}

function FloatingButton({ href, label, className, delay, children }) {
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
      {children}
    </motion.a>
  );
}
