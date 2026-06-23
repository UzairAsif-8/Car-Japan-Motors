import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Pencil, Trash2, Star } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import useAsync from '../../hooks/useAsync';
import { getAdminCars, deleteCar, updateCarStatus } from '../../services/carService';
import { CAR_STATUS, CAR_STATUS_OPTIONS } from '../../constants';
import { formatPrice, formatMileage } from '../../lib/format';

export default function AdminCars() {
  const { data, loading } = useAsync(() => getAdminCars(), []);
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    if (data) setCars(data);
  }, [data]);

  const filtered = useMemo(() => {
    if (!query) return cars;
    const q = query.toLowerCase();
    return cars.filter((c) => c.name.toLowerCase().includes(q) || c.make.toLowerCase().includes(q));
  }, [cars, query]);

  const handleStatusChange = async (car, nextStatus) => {
    if (car.status === nextStatus) return;
    setStatusUpdating(car._id);
    try {
      const updated = await updateCarStatus(car._id, nextStatus);
      setCars((prev) =>
        prev.map((c) => (c._id === car._id ? { ...c, ...updated, status: nextStatus } : c))
      );
    } finally {
      setStatusUpdating(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteCar(toDelete._id);
      setCars((prev) => prev.filter((c) => c._id !== toDelete._id));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Vehicles</h1>
          <p className="mt-1 text-ink-500">{cars.length} vehicles in your inventory.</p>
        </div>
        <Button to="/admin/cars/new" icon={PlusCircle}>
          Add Vehicle
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vehicles…"
          className="h-12 w-full rounded-2xl border border-ink-100 bg-white pl-12 pr-4 text-[15px] outline-none transition-colors focus:border-ink-900"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : (
          <AdminTable
            keyField="_id"
            data={filtered}
            empty="No vehicles match your search."
            columns={[
              {
                key: 'name',
                header: 'Vehicle',
                render: (r) => (
                  <div className="flex items-center gap-3">
                    <img src={r.images?.[0]} alt="" loading="lazy" decoding="async" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                    <div>
                      <p className="flex items-center gap-1.5 font-semibold text-ink">
                        {r.model}
                        {r.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      </p>
                      <p className="text-xs text-ink-400">{r.make} · {r.variant}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'year', header: 'Year' },
              { key: 'mileage', header: 'Mileage', render: (r) => formatMileage(r.mileage) },
              {
                key: 'bodyType',
                header: 'Type',
                render: (r) => <Badge tone="neutral">{r.bodyType}</Badge>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <div className="min-w-[140px] space-y-2">
                    <StatusBadge status={r.status || CAR_STATUS.AVAILABLE} />
                    <div className="flex flex-wrap gap-1">
                      {CAR_STATUS_OPTIONS.filter((o) => o.value !== (r.status || CAR_STATUS.AVAILABLE)).map(
                        (o) => (
                          <button
                            key={o.value}
                            type="button"
                            disabled={statusUpdating === r._id}
                            onClick={() => handleStatusChange(r, o.value)}
                            className="rounded-lg border border-ink-100 px-2 py-1 text-[11px] font-semibold text-ink-500 transition-colors hover:border-ink-300 hover:bg-ink-50 hover:text-ink disabled:opacity-50"
                          >
                            Mark {o.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: 'price',
                header: 'Price',
                render: (r) => <span className="font-semibold text-ink">{formatPrice(r.price)}</span>,
              },
              {
                key: 'actions',
                header: 'Actions',
                align: 'right',
                render: (r) => (
                  <div className="inline-flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/cars/${r._id}/edit`}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink"
                      aria-label="Edit"
                    >
                      <Pencil className="h-[18px] w-[18px]" />
                    </Link>
                    <button
                      onClick={() => setToDelete(r)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} label="Confirm delete">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-ink">Delete this vehicle?</h3>
        <p className="mt-2 text-ink-500">
          {toDelete?.name} will be removed from your inventory. This action cannot be undone.
        </p>
        <div className="mt-7 flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setToDelete(null)}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth loading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
