import { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import useAsync from '../hooks/useAsync';
import { getVideos } from '../services/videoService';
import { getYouTubeVideoId } from '../lib/youtube';
import YouTubeLazyEmbed from '../components/YouTubeLazyEmbed';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import { Skeleton } from '../components/ui/Skeleton';

import 'swiper/css';

export default function VideoCarousel() {
  const { data: videos, loading } = useAsync(() => getVideos(), []);
  const [playingId, setPlayingId] = useState(null);

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
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              speed={450}
              loop={slides.length > 1}
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
          )}
        </div>
      </div>
    </section>
  );
}
