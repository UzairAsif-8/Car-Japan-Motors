import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/format';

/** Slide-in drawer used for mobile navigation and the inventory filters. */
export default function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  children,
  className,
  width = 'max-w-sm',
}) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const isRight = side === 'right';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              'absolute top-0 flex h-full w-full flex-col bg-white shadow-elevated',
              width,
              isRight ? 'right-0' : 'left-0',
              className
            )}
            initial={{ x: isRight ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRight ? '100%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
              <span className="font-display text-lg font-bold text-ink">{title}</span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink focus-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
