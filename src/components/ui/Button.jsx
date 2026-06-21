import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/format';

const VARIANTS = {
  primary:
    'bg-brand text-white shadow-[0_8px_24px_-8px_rgba(216,30,44,0.55)] hover:bg-brand-600',
  dark: 'bg-ink text-white hover:bg-ink-800 shadow-[0_8px_24px_-10px_rgba(22,24,29,0.6)]',
  outline:
    'border border-ink-200 bg-white text-ink hover:border-ink-900 hover:bg-ink-50',
  ghost: 'text-ink hover:bg-ink-50',
  whatsapp: 'bg-[#1faf54] text-white hover:bg-[#1a9d4b] shadow-[0_8px_24px_-10px_rgba(31,175,84,0.6)]',
  light: 'bg-white/90 text-ink hover:bg-white border border-white/60 backdrop-blur',
};

const SIZES = {
  sm: 'h-10 px-4 text-sm gap-1.5',
  md: 'h-12 px-6 text-[15px] gap-2',
  lg: 'h-14 px-8 text-base gap-2.5',
};

const MotionLink = motion.create(Link);

const Button = forwardRef(function Button(
  {
    as = 'button',
    to,
    href,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    fullWidth = false,
    className,
    children,
    ...props
  },
  ref
) {
  const classes = cn(
    'group relative inline-flex items-center justify-center rounded-full font-semibold tracking-tight',
    'transition-colors duration-300 ease-smooth focus-ring disabled:opacity-60 disabled:pointer-events-none',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className
  );

  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  };

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-[1.15em] w-[1.15em] animate-spin" />
      ) : (
        Icon && <Icon className="h-[1.15em] w-[1.15em]" strokeWidth={2} />
      )}
      {children}
      {IconRight && !loading && (
        <IconRight
          className="h-[1.15em] w-[1.15em] transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </>
  );

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={classes} {...motionProps} {...props}>
        {content}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={classes}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button ref={ref} className={classes} {...motionProps} {...props}>
      {content}
    </motion.button>
  );
});

export default Button;
