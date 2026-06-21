import { useEffect, useState } from 'react';

/** Returns the current vertical scroll offset and whether the page is scrolled past a threshold. */
export default function useScrollPosition(threshold = 24) {
  const [state, setState] = useState({ y: 0, scrolled: false });

  useEffect(() => {
    let frame = null;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setState({ y, scrolled: y > threshold });
        frame = null;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}
