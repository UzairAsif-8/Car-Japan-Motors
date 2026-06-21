import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/format';

/**
 * Brand logo. Loads the business logo from `/logo.png` (drop your file in the
 * `public/` folder) and shows "Car Japan Motors" in small caps beneath it.
 *
 * Until the logo file is present it falls back to a clean monogram so the UI
 * never looks broken.
 *
 *  - `light`  : white label text, for dark backgrounds (hero, sidebar, login)
 *  - `chip`   : wrap the logo in a white rounded backing (use on very dark,
 *               solid panels where the logo's dark strokes need contrast)
 *  - `size`   : sm | md | lg
 */
const SIZES = {
  sm: 'h-7',
  md: 'h-9 sm:h-10',
  lg: 'h-12 sm:h-14',
};

const LABEL_SIZES = {
  sm: 'text-[10px] sm:text-[11px]',
  md: 'text-xs sm:text-sm',
  lg: 'text-sm sm:text-base',
};

/** Larger label styling for the main site navbar. */
const NAV_LABEL = 'text-sm font-bold tracking-[0.12em] sm:text-base';

export default function Logo({ light = false, chip = false, size = 'md', nav = false, className }) {
  const [error, setError] = useState(false);

  return (
    <Link
      to="/"
      aria-label="Car Japan Motors — home"
      className={cn('group inline-flex flex-col items-center gap-1', className)}
    >
      {error ? (
        <span
          className={cn(
            'grid aspect-[1.6] place-items-center rounded-xl bg-brand px-3 font-display font-extrabold leading-none text-white shadow-[0_6px_16px_-6px_rgba(216,30,44,0.6)]',
            SIZES[size]
          )}
        >
          CJ
        </span>
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]',
            chip && 'rounded-xl bg-white px-2.5 py-1.5 shadow-sm'
          )}
        >
          <img
            src="/logo.png"
            alt="Car Japan Motors"
            onError={() => setError(true)}
            className={cn('w-auto object-contain', SIZES[size])}
          />
        </span>
      )}
      <span
        className={cn(
          'font-semibold uppercase leading-none whitespace-nowrap',
          nav ? NAV_LABEL : cn('tracking-[0.24em]', LABEL_SIZES[size]),
          light ? (nav ? 'text-white/95' : 'text-white/75') : 'text-ink-500'
        )}
      >
        Car Japan Motors
      </span>
    </Link>
  );
}
