import { motion } from 'framer-motion';
import { cn } from '../../lib/format';

/** Compact, bright page header used on interior pages. */
export default function PageHero({ eyebrow, title, description, children, className }) {
  return (
    <section className={cn('relative overflow-hidden bg-mist-100 pb-12 pt-32 sm:pt-36', className)}>
      <div className="pointer-events-none absolute -right-32 -top-20 h-72 w-72 rounded-full bg-brand/5 blur-3xl" />
      <div className="mx-auto max-w-8xl container-px">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            <span className="h-px w-6 bg-brand" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500"
          >
            {description}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
