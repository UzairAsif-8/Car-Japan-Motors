import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Calendar,
  Gauge,
  Cog,
  Fuel,
  Settings2,
  MapPin,
  Users,
  Car,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import VehicleGallery from '../components/VehicleGallery';
import PriceCard, { SpecPill } from '../components/PriceCard';
import VehicleCard from '../components/VehicleCard';
import Carousel from '../components/Carousel';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import Reveal from '../components/ui/Reveal';
import SectionHeading from '../components/ui/SectionHeading';
import useVehicles from '../hooks/useVehicles';
import { getCarById, getSimilarCars } from '../services/carService';
import VehicleFetchError from '../components/VehicleFetchError';
import { formatMileage } from '../lib/format';
import { CAR_STATUS } from '../constants';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: car, loading, error, isRetrying, refetch } = useVehicles(() => getCarById(id), [id]);
  const { data: similar } = useVehicles(
    () => (car ? getSimilarCars(car, 6) : Promise.resolve([])),
    [car?._id]
  );

  if (loading) return <DetailsSkeleton />;

  if (error) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-8xl container-px py-24">
          <VehicleFetchError onRetry={refetch} retrying={isRetrying} />
        </div>
      </PageTransition>
    );
  }

  if (!car) {
    return (
      <PageTransition>
        <div className="grid min-h-[70vh] place-items-center px-6 pt-24 text-center">
          <div>
            <Car className="mx-auto h-14 w-14 text-ink-200" strokeWidth={1.4} />
            <h1 className="mt-6 font-display text-3xl font-bold text-ink">Vehicle not found</h1>
            <p className="mt-2 text-ink-500">This listing may have been sold or removed.</p>
            <Button to="/inventory" variant="dark" icon={ArrowLeft} className="mt-7">
              Back to Inventory
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const status = car.status || CAR_STATUS.AVAILABLE;

  const specs = [
    { icon: Calendar, label: 'Year', value: car.year },
    { icon: Gauge, label: 'Mileage', value: formatMileage(car.mileage) },
    { icon: Settings2, label: 'Engine', value: car.engine },
    { icon: Cog, label: 'Transmission', value: car.transmission },
    { icon: Fuel, label: 'Fuel Type', value: car.fuel },
    { icon: MapPin, label: 'Registered', value: car.registration },
    { icon: Car, label: 'Drivetrain', value: car.drivetrain },
    { icon: Users, label: 'Seats', value: `${car.seats} Seats` },
  ];

  return (
    <PageTransition>
      <div className="bg-white pt-24">
        <div className="mx-auto max-w-8xl container-px">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 py-5 text-sm text-ink-400">
            <Link to="/" className="transition-colors hover:text-ink">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/inventory" className="transition-colors hover:text-ink">Inventory</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="truncate font-medium text-ink-700">{car.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
            {/* Left column */}
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge tone="brand">{car.make}</Badge>
                <Badge tone="neutral">{car.bodyType}</Badge>
                {car.condition === 'Imported' && <Badge tone="dark">Imported</Badge>}
                {car.featured && status === CAR_STATUS.AVAILABLE && (
                  <Badge tone="success" icon={Sparkles}>Featured</Badge>
                )}
                {status === CAR_STATUS.SOLD && <Badge tone="danger">SOLD</Badge>}
                {status === CAR_STATUS.UPCOMING && <Badge tone="warning">COMING SOON</Badge>}
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {car.name}
              </h1>
              <p className="mt-1.5 text-ink-400">{car.variant} · {car.color}</p>

              <div className="mt-7">
                <VehicleGallery images={car.images} alt={car.name} />
              </div>

              {/* Sticky inquiry — mobile, appears under the gallery */}
              <div className="mt-8 lg:hidden">
                <PriceCard car={car} />
              </div>

              {/* Specs */}
              <section className="mt-12">
                <h2 className="font-display text-2xl font-bold text-ink">Specifications</h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {specs.map((s, i) => (
                    <Reveal key={s.label} delay={i * 0.04}>
                      <SpecPill icon={s.icon} label={s.label} value={s.value} />
                    </Reveal>
                  ))}
                </div>
              </section>

              {/* Highlights */}
              {car.highlights?.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-ink">Highlights</h2>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {car.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center gap-2 rounded-2xl border border-ink-100 bg-mist-100 px-4 py-2.5 text-sm font-semibold text-ink-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-brand" />
                        {h}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Description — content entered by the admin from the dashboard */}
              {car.description?.trim() && (
                <section className="mt-12 border-t border-ink-100 pt-10">
                  <h2 className="font-display text-2xl font-bold text-ink">Description</h2>
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-ink-500">
                    {car.description}
                  </p>
                </section>
              )}
            </div>

            {/* Right column — sticky on desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <PriceCard car={car} />
              </div>
            </aside>
          </div>
        </div>

        {/* Similar vehicles */}
        {similar?.length > 0 && (
          <section className="mt-20 bg-mist-100 section-py">
            <div className="mx-auto max-w-8xl container-px">
              <SectionHeading
                eyebrow="You may also like"
                title="Similar vehicles"
                description="Hand-picked alternatives that match this vehicle’s class and budget."
              />
              <div className="mt-10">
                <Carousel itemClassName="w-[300px] sm:w-[340px]" ariaLabel="Similar vehicles">
                  {similar.map((c, i) => (
                    <VehicleCard key={c._id} car={c} index={i} />
                  ))}
                </Carousel>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
}

function DetailsSkeleton() {
  return (
    <div className="bg-white pt-28">
      <div className="mx-auto max-w-8xl container-px py-6">
        <Skeleton className="h-4 w-64" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-4 h-10 w-3/4" />
            <Skeleton className="mt-6 aspect-[16/10] w-full rounded-3xl" />
            <div className="mt-3 grid grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[480px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
