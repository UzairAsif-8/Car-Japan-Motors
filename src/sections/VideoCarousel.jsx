import { useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAsync from '../hooks/useAsync';
import { getVideos } from '../services/videoService';
import { getYouTubeVideoId } from '../lib/youtube';
import YouTubeLazyEmbed from '../components/YouTubeLazyEmbed';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/format';

import 'swiper/css';

export default function VideoCarousel() {
  const { data: videos, loading } = useAsync(() => getVideos(), []);
  const [playingId, setPlayingId] = useState(null);
  const swiperRef = useRef(null);

  const slides = useMemo(
    () =>
      (videos || [])
        .map((video) => ({
          ...video,
          videoId: video.videoId || getYouTubeVideoId(video.url),
        }))
        .filter((video) => video.videoId),
    [videos]
  );

  if (!loading && slides.length === 0) return null;

  return (
    <section className="bg-white section-py">
      <div className="mx-auto max-w-8xl container-px">
        <Reveal>
          <SectionHeading
            eyebrow="Showroom videos"
            title="See our vehicles in action"
            description="Walk through recent arrivals, customer handovers, and behind-the-scenes moments from Car Japan Motors."
            className="max-w-xl"
          />
        </Reveal>

        <div className="mt-10">
          {loading ? (
            <Skeleton className="aspect-video w-full rounded-3xl" />
          ) : (
            <div className="relative">
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                speed={450}
                loop={slides.length > 1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                autoplay={
                  playingId
                    ? false
                    : {
                        delay: 1000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                }
                onSlideChange={() => setPlayingId(null)}
                className="overflow-hidden rounded-3xl border border-ink-100 bg-ink shadow-card"
              >
                {slides.map((video) => (
                  <SwiperSlide key={video.id}>
                    <div className="relative aspect-video w-full bg-ink">
                      <YouTubeLazyEmbed
                        videoId={video.videoId}
                        title={`YouTube video ${video.videoId}`}
                        active={playingId === video.id}
                        onActivate={() => setPlayingId(video.id)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {slides.length > 1 && (
                <>
                  <CarouselNav
                    label="Previous video"
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="left-3 sm:left-4"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </CarouselNav>
                  <CarouselNav
                    label="Next video"
                    onClick={() => swiperRef.current?.slideNext()}
                    className="right-3 sm:right-4"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </CarouselNav>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CarouselNav({ onClick, label, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink-900/75 text-white shadow-lg backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-ink sm:h-12 sm:w-12',
        className
      )}
    >
      {children}
    </button>
  );
}
