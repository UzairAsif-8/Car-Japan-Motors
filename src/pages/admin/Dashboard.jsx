import { Link } from 'react-router-dom';
import { Car, MessageSquare, TrendingUp, Eye, ArrowRight, PlusCircle, Star } from 'lucide-react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import useAsync from '../../hooks/useAsync';
import { getAdminCars, getDashboardStats } from '../../services/carService';
import { getInquiries } from '../../services/inquiryService';
import { CAR_STATUS } from '../../constants';
import { formatPrice } from '../../lib/format';

export default function Dashboard() {
  const { data: stats, loading: statsLoading } = useAsync(() => getDashboardStats(), []);
  const { data: cars, loading: carsLoading } = useAsync(() => getAdminCars(), []);
  const { data: inquiries, loading: inqLoading } = useAsync(() => getInquiries(), []);

  const carList = cars || [];
  const inqList = inquiries || [];

  const dashboardStats = [
    { icon: Car, label: 'Total Cars', value: stats?.totalCars ?? '—', accent: 'ink' },
    { icon: TrendingUp, label: 'Available Cars', value: stats?.available ?? '—', accent: 'emerald' },
    { icon: Car, label: 'Sold Cars', value: stats?.sold ?? '—', accent: 'brand' },
    { icon: Eye, label: 'Upcoming Cars', value: stats?.upcoming ?? '—', accent: 'amber' },
    { icon: MessageSquare, label: 'Total Inquiries', value: stats?.totalInquiries ?? '—', accent: 'ink' },
    { icon: Star, label: 'Total Reviews', value: stats?.totalReviews ?? '—', accent: 'amber' },
  ];

  const loading = statsLoading || carsLoading || inqLoading;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-ink-500">Welcome back — here’s what’s happening at the showroom.</p>
        </div>
        <Button to="/admin/cars/new" icon={PlusCircle}>
          Add Vehicle
        </Button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)
          : dashboardStats.map((s, i) => <AdminStatCard key={s.label} index={i} {...s} />)}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Recent inquiries */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-1.5">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {inqLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <AdminTable
              keyField="_id"
              data={inqList.slice(0, 5)}
              columns={[
                {
                  key: 'name',
                  header: 'Customer',
                  render: (r) => (
                    <div>
                      <p className="font-semibold text-ink">{r.name}</p>
                      <p className="text-xs text-ink-400">{r.phone}</p>
                    </div>
                  ),
                },
                { key: 'carName', header: 'Vehicle', render: (r) => r.carName || '—' },
                {
                  key: 'status',
                  header: 'Status',
                  align: 'right',
                  render: (r) => (
                    <Badge tone={r.status === 'new' ? 'brand' : 'success'}>{r.status}</Badge>
                  ),
                },
              ]}
            />
          )}
        </section>

        {/* Recent vehicles */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Latest Vehicles</h2>
            <Link to="/admin/cars" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-1.5">
              Manage <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {carsLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <AdminTable
              keyField="_id"
              data={carList.slice(0, 5)}
              columns={[
                {
                  key: 'name',
                  header: 'Vehicle',
                  render: (r) => (
                    <div className="flex items-center gap-3">
                      <img src={r.images?.[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-ink">{r.model}</p>
                        <p className="text-xs text-ink-400">{r.make} · {r.year}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => <StatusBadge status={r.status || CAR_STATUS.AVAILABLE} />,
                },
                {
                  key: 'price',
                  header: 'Price',
                  align: 'right',
                  render: (r) => (
                    <span className="font-semibold text-ink">{formatPrice(r.price)}</span>
                  ),
                },
              ]}
            />
          )}
        </section>
      </div>
    </div>
  );
}
