import { useEffect } from 'react';

/** Locks body scroll while `locked` is true (used by drawers and modals). */
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
