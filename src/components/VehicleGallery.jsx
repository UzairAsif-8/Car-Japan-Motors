import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from './ui/Image';
import Modal from './ui/Modal';
import { cn } from '../lib/format';

/**
 * Editorial gallery: large hero frame with cross-fade, thumbnail strip, and a
 * fullscreen lightbox with keyboard + arrow navigation.
 */
export default function VehicleGallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const go = useCallback(
    (dir) => setActive((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, go]);

  if (!images.length) return null;

  return (
    <div>
      <div className="group relative aspect-[16/11] overflow-hidden rounded-3xl bg-mist-200 shadow-card sm:aspect-[16/10]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image src={images[active]} alt={`${alt} — view ${active + 1}`} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setFullscreen(true)}
          aria-label="View fullscreen"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur transition-all duration-300 hover:scale-105"
        >
          <Expand className="h-5 w-5" />
        </button>

        {images.length > 1 && (
          <>
            <GalleryArrow side="left" onClick={() => go(-1)} />
            <GalleryArrow side="right" onClick={() => go(1)} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink-900/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-xl transition-all duration-300',
                i === active
                  ? 'ring-2 ring-brand ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt={`${alt} thumbnail ${i + 1}`} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}

      <Modal open={fullscreen} onClose={() => setFullscreen(false)} bare className="max-w-6xl" label="Vehicle gallery">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={`${alt} — fullscreen ${active + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[82vh] w-full rounded-2xl object-contain"
            />
          </AnimatePresence>
          <GalleryArrow side="left" onClick={() => go(-1)} light />
          <GalleryArrow side="right" onClick={() => go(1)} light />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {active + 1} / {images.length}
          </div>
        </div>
      </Modal>
    </div>
  );
}

function GalleryArrow({ side, onClick, light }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full shadow-card backdrop-blur transition-all duration-300 hover:scale-105',
        side === 'left' ? 'left-4' : 'right-4',
        light ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/90 text-ink opacity-0 group-hover:opacity-100'
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
