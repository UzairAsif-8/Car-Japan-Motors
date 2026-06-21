import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/format';

/**
 * Resilient image with a built-in skeleton shimmer and a graceful fallback
 * if the source fails to load. Keeps the UI premium even when a CDN hiccups.
 */
export default function Image({ src, alt = '', className, imgClassName, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-mist-200', className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-mist-200 to-mist-300" />
      )}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-mist-200 text-ink-300">
          <ImageOff className="h-8 w-8" strokeWidth={1.5} />
          <span className="text-xs font-medium tracking-wide">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
          {...props}
        />
      )}
    </div>
  );
}
