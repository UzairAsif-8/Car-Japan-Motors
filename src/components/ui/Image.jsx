import { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/format';

/**
 * Resilient image with a built-in skeleton shimmer and a graceful fallback
 * if the source fails to load. Keeps the UI premium even when a CDN hiccups.
 */
export default function Image({ src, alt = '', className, imgClassName, loading = 'lazy', ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const hasObjectFit = imgClassName && /\bobject-/.test(imgClassName);
  const usesIntrinsicHeight = imgClassName && /\b(h-auto|max-h-|object-contain)/.test(imgClassName);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

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
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'transition-opacity duration-700',
            usesIntrinsicHeight ? 'h-auto w-full' : 'h-full w-full',
            !hasObjectFit && 'object-cover',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
          {...props}
        />
      )}
    </div>
  );
}
