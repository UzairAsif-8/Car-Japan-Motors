import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import useAsync from '../hooks/useAsync';
import { getVideos } from '../services/videoService';
import { getYouTubeEmbedUrl } from '../lib/youtube';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import { Skeleton } from '../components/ui/Skeleton';

import 'swiper/css';

export default function VideoCarousel() {
  const { data: videos, loading } = useAsync(() => getVideos(), []);

  const slides = useMemo(
    () =>
      (videos || [])
        .map((video) => ({
          ...video,
          embedUrl: getYouTubeEmbedUrl(video.url),
        }))
        .filter((video) => video.embedUrl),
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
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              loop={slides.length > 1}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="overflow-hidden rounded-3xl border border-ink-100 bg-ink shadow-card"
            >
              {slides.map((video) => (
                <SwiperSlide key={video.id}>
                  <div className="relative aspect-video w-full bg-ink">
                    <iframe
                      src={`${video.embedUrl}?rel=0&modestbranding=1`}
                      title={`YouTube video ${video.videoId}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
}
