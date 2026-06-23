import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../lib/youtube';
import { cn } from '../lib/format';

/**
 * YouTube facade — shows a thumbnail until the user clicks, then loads the iframe.
 * Avoids pulling YouTube embed scripts on initial page load.
 */
export default function YouTubeLazyEmbed({
  videoId,
  title = 'YouTube video',
  active: controlledActive,
  onActivate,
  className,
}) {
  const [internalActive, setInternalActive] = useState(false);
  const active = controlledActive ?? internalActive;

  if (!videoId) return null;

  const embedBase = getYouTubeEmbedUrl(videoId) || `https://www.youtube.com/embed/${videoId}`;
  const thumbnail = getYouTubeThumbnailUrl(videoId);

  const handleActivate = () => {
    onActivate?.();
    if (controlledActive === undefined) setInternalActive(true);
  };

  if (active) {
    return (
      <iframe
        src={`${embedBase}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        className={cn('absolute inset-0 h-full w-full', className)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleActivate}
      className={cn(
        'group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden bg-ink',
        className
      )}
      aria-label={`Play ${title}`}
    >
      <img
        src={thumbnail}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 bg-ink-900/35 transition-colors group-hover:bg-ink-900/25" />
      <span className="relative grid h-16 w-16 place-items-center rounded-full bg-brand text-white shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]">
        <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
      </span>
    </button>
  );
}
