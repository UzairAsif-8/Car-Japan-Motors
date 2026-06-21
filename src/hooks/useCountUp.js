import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Smoothly counts up to `end` once the element enters the viewport.
 * Returns [value, ref] — attach the ref to the element you want to observe.
 */
export default function useCountUp(end, { duration = 1800, decimals = 0 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let raf;
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = easeOut(progress) * end;
      setValue(Number(current.toFixed(decimals)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration, decimals]);

  return [value, ref];
}
