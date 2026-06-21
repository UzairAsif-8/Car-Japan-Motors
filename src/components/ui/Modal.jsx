import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/format';

/**
 * Accessible, animated modal rendered through a portal. Closes on overlay
 * click and Escape. Used for the fullscreen gallery and confirmations.
 */
export default function Modal({ open, onClose, children, className, bare = false, label = 'Dialog' }) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.div
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'relative z-10 w-full',
              bare ? '' : 'max-w-lg rounded-3xl bg-white p-6 shadow-elevated sm:p-8',
              className
            )}
            variants={{
              hidden: { opacity: 0, scale: 0.96, y: 16 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {!bare && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink focus-ring"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
