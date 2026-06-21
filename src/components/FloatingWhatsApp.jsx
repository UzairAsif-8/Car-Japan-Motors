import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppLink, CONTACT } from '../constants';

/** Persistent, gentle floating WhatsApp affordance with an inviting tooltip. */
export default function FloatingWhatsApp() {
  const [hint, setHint] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-7 sm:right-7">
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
              onClick={() => setHint(false)}
              aria-label="Dismiss"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a
        href={buildWhatsAppLink(`Hi Car Japan, I'm browsing your inventory and have a question.`)}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat on WhatsApp ${CONTACT.whatsapp}`}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1faf54] text-white shadow-[0_12px_32px_-8px_rgba(31,175,84,0.65)]"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#1faf54] opacity-20" />
        <MessageCircle className="h-7 w-7" />
      </motion.a>
    </div>
  );
}
