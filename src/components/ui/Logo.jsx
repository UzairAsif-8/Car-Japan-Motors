import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/format';

/**
 * Brand logo — loads `/logo.png` (full wordmark with icon).
 *
 *  - `chip`  : premium white backing for dark panels (admin sidebar, login)
 *  - `size`  : sm | md | lg | admin | footer | nav | navCompact
 */
const SIZES = {
  sm: 'h-9 w-auto',
  md: 'h-11 w-auto sm:h-12',
  lg: 'h-14 w-auto sm:h-16',
  admin: 'h-20 w-auto sm:h-28',
  footer: 'h-28 w-auto sm:h-32 md:h-36 lg:h-44',
  nav: 'h-32 w-auto sm:h-40 md:h-48 lg:h-56',
  navCompact: 'h-20 w-auto sm:h-24 lg:h-32',
};

const CHIP =
  'rounded-xl bg-white px-2 py-1 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.4)] ring-1 ring-white/70 sm:rounded-2xl sm:px-2.5 sm:py-1.5';

export default function Logo({ chip = false, size = 'md', className }) {
  const [error, setError] = useState(false);

  return (
    <Link
      to="/"
      aria-label="Car Japan Motors — home"
      className={cn(
        'group relative z-20 inline-flex shrink-0 items-center justify-center leading-none',
        'rounded-xl p-1.5 -m-1.5 transition-transform duration-500 hover:scale-[1.02] focus-ring',
        SIZES[size],
        className
      )}
    >
      {error ? (
        <span
          className={cn(
            'pointer-events-none grid aspect-[2.2] h-full w-auto place-items-center rounded-xl bg-brand px-4 font-display text-sm font-extrabold leading-none text-white shadow-[0_6px_20px_-6px_rgba(216,30,44,0.55)]'
          )}
        >
          CJ
        </span>
      ) : (
        <span
          className={cn(
            'flex h-full w-full items-center justify-center',
            chip && CHIP
          )}
        >
          <img
            src="/logo.png"
            alt=""
            aria-hidden
            loading="eager"
            decoding="async"
            onError={() => setError(true)}
            className="pointer-events-none block h-full w-auto max-w-full object-contain"
          />
        </span>
      )}
    </Link>
  );
}
