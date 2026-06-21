import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Gauge, Fuel, Cog, ArrowUpRight, MessageCircle } from 'lucide-react';
import Image from './ui/Image';
import Badge from './ui/Badge';
import { buildWhatsAppLink } from '../constants';
import { formatPrice, formatMileage, cn } from '../lib/format';

/**
 * Premium vehicle card. On hover (desktop) it runs an automatic, cross-fading
 * image slideshow with a subtle zoom and elevates off the page.
 */
export default function VehicleCard({ car, index = 0, layout = 'grid' }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timer = useRef(null);
  const images = car.images?.length ? car.images : [car.image];

  useEffect(() => {
    if (hovered && images.length > 1) {
      timer.current = setInterval(
        () => setActive((i) => (i + 1) % images.length),
        1100
      );
    } else {
      clearInterval(timer.current);
      setActive(0);
    }
    return () => clearInterval(timer.current);
  }, [hovered, images.length]);

  const waMessage = `Hi Car Japan, I'm interested in the ${car.name} (${car.year}) listed at ${formatPrice(
    car.price
  )}. Is it available?`;

  if (layout === 'list') {
    return <VehicleListCard car={car} index={index} waMessage={waMessage} />;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft card-hover hover:-translate-y-1.5 hover:border-ink-200/80 hover:shadow-card"
    >
      <Link to={`/inventory/${car._id}`} className="relative block aspect-[4/3] overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={car.name}
              className="h-full w-full"
              imgClassName={cn(
                'transition-transform duration-[1200ms] ease-smooth',
                hovered ? 'scale-110' : 'scale-100'
              )}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent opacity-70" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge tone="light">{car.year}</Badge>
          {car.condition === 'Imported' && <Badge tone="dark">Imported</Badge>}
          {car.featured && <Badge tone="brand">Featured</Badge>}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full bg-white transition-all duration-300',
                  i === active ? 'w-6' : 'w-1.5 bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{car.make}</p>
        <Link to={`/inventory/${car._id}`}>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand">
            {car.model} <span className="text-ink-400">{car.variant}</span>
          </h3>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-ink-500">
          <Spec icon={Calendar}>{car.year}</Spec>
          <Spec icon={Gauge}>{formatMileage(car.mileage)}</Spec>
          <Spec icon={Cog}>{car.transmission}</Spec>
          <Spec icon={Fuel}>{car.fuel}</Spec>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Price</p>
            <p className="font-display text-xl font-extrabold tracking-tight text-ink">
              {formatPrice(car.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={buildWhatsAppLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              aria-label="Enquire on WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#1faf54]/10 text-[#1faf54] transition-all duration-300 hover:bg-[#1faf54] hover:text-white"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </a>
            <Link
              to={`/inventory/${car._id}`}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-all duration-300 hover:bg-brand"
              aria-label="View details"
            >
              <ArrowUpRight className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function VehicleListCard({ car, index, waMessage }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="group grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft card-hover hover:border-ink-200/80 hover:shadow-card sm:grid-cols-[300px_1fr]"
    >
      <Link to={`/inventory/${car._id}`} className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
        <Image
          src={car.images?.[0]}
          alt={car.name}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone="light">{car.year}</Badge>
          {car.featured && <Badge tone="brand">Featured</Badge>}
        </div>
      </Link>

      <div className="flex flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{car.make}</p>
        <Link to={`/inventory/${car._id}`}>
          <h3 className="mt-1 font-display text-xl font-bold text-ink transition-colors group-hover:text-brand">
            {car.model} {car.variant}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-ink-500">
          {car.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-500">
          <Spec icon={Gauge}>{formatMileage(car.mileage)}</Spec>
          <Spec icon={Cog}>{car.transmission}</Spec>
          <Spec icon={Fuel}>{car.fuel}</Spec>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
          <p className="font-display text-2xl font-extrabold text-ink">{formatPrice(car.price)}</p>
          <div className="flex gap-2">
            <a
              href={buildWhatsAppLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#1faf54]/10 px-4 text-sm font-semibold text-[#1faf54] transition-colors hover:bg-[#1faf54] hover:text-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link
              to={`/inventory/${car._id}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              View Details <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4 text-ink-300" strokeWidth={1.8} />
      <span className="font-medium text-ink-600">{children}</span>
    </span>
  );
}
