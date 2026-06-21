import Reveal from './Reveal';
import { cn } from '../../lib/format';

/** Consistent, editorial section header used across marketing sections. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  light = false,
}) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'max-w-2xl',
        centered && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">
            <span className="h-px w-6 bg-brand" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            'mt-4 display-2 text-balance',
            light ? 'text-white' : 'text-ink'
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              'mt-5 text-lg leading-relaxed',
              light ? 'text-white/70' : 'text-ink-500'
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
