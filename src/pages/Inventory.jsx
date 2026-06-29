import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, LayoutGrid, Rows3, ChevronDown } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/ui/PageHero';
import FilterSidebar from '../components/FilterSidebar';
import VehicleGrid from '../components/VehicleGrid';
import Drawer from '../components/ui/Drawer';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import useInventoryFilters from '../hooks/useInventoryFilters';
import useVehicles from '../hooks/useVehicles';
import { getCars } from '../services/carService';
import { SORT_OPTIONS, INVENTORY_STATUS_FILTERS } from '../constants';
import { VEHICLE_EMPTY_MESSAGE } from '../components/VehicleFetchError';
import { cn } from '../lib/format';

const PER_PAGE = 9;

export default function Inventory() {
  const { filters, setFilters, resetFilters, queryParams } = useInventoryFilters();
  const [layout, setLayout] = useState('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: cars, loading, error, isRetrying, refetch } = useVehicles(
    () => getCars(queryParams),
    [JSON.stringify(queryParams)]
  );

  // Reset to first page whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(queryParams)]);

  const hasActiveFilters = useMemo(
    () =>
      ['search', 'make', 'model', 'year', 'transmission', 'fuel', 'bodyType', 'minPrice', 'maxPrice'].some(
        (key) => filters[key]
      ),
    [filters]
  );

  const list = cars ?? [];
  const totalPages = Math.ceil(list.length / PER_PAGE);
  const paged = useMemo(
    () => list.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [list, page]
  );

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  return (
    <PageTransition>
      <PageHero
        eyebrow="Inventory"
        title="Find your next car"
        description="Browse our full collection of inspected, ready-to-drive Japanese vehicles. Refine by make, body type, budget and more."
      />

      <section className="mx-auto max-w-8xl container-px py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                resultCount={list.length}
              />
            </div>
          </aside>

          <div>
            {/* Status filters */}
            <div className="mb-4 flex flex-wrap gap-2">
              {INVENTORY_STATUS_FILTERS.map((f) => (
                <button
                  key={f.value || 'all'}
                  type="button"
                  onClick={() => setFilters({ status: f.value })}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300',
                    (filters.status || '') === f.value
                      ? 'border-ink bg-ink text-white shadow-soft'
                      : 'border-ink-100 bg-white text-ink-600 hover:border-ink-300 hover:text-ink'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setDrawerOpen(true)}
                  variant="outline"
                  size="sm"
                  icon={SlidersHorizontal}
                  className="lg:hidden"
                >
                  Filters
                </Button>
                <p className="text-sm text-ink-500">
                  {loading ? (
                    isRetrying ? 'Waking up server…' : 'Loading…'
                  ) : error ? (
                    'Unable to load inventory'
                  ) : (
                    <>
                      <span className="font-semibold text-ink">{list.length}</span>{' '}
                      vehicles
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={filters.sort || 'featured'}
                    onChange={(e) => setFilters({ sort: e.target.value })}
                    className="h-11 appearance-none rounded-full border border-ink-100 bg-white pl-4 pr-10 text-sm font-semibold text-ink-700 outline-none transition-colors hover:border-ink-300 focus:border-ink-900"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        Sort: {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </div>

                <div className="hidden items-center gap-1 rounded-full border border-ink-100 bg-white p-1 sm:flex">
                  <ViewToggle active={layout === 'grid'} onClick={() => setLayout('grid')} label="Grid view">
                    <LayoutGrid className="h-[18px] w-[18px]" />
                  </ViewToggle>
                  <ViewToggle active={layout === 'list'} onClick={() => setLayout('list')} label="List view">
                    <Rows3 className="h-[18px] w-[18px]" />
                  </ViewToggle>
                </div>
              </div>
            </div>

            <VehicleGrid
              cars={paged}
              loading={loading}
              error={error}
              isRetrying={isRetrying}
              onRetry={refetch}
              layout={layout}
              skeletonCount={6}
              onReset={resetFilters}
              emptyMessage={hasActiveFilters ? 'No vehicles match your search' : VEHICLE_EMPTY_MESSAGE}
            />

            {!loading && !error && totalPages > 1 && (
              <div className="mt-12">
                <Pagination page={page} totalPages={totalPages} onChange={handlePage} />
              </div>
            )}
          </div>
        </div>
      </section>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" title="Filters" width="max-w-[88vw] sm:max-w-md">
        <div className="p-6">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            resultCount={list.length}
          />
          <Button onClick={() => setDrawerOpen(false)} fullWidth className="mt-8">
            Show {list.length} results
          </Button>
        </div>
      </Drawer>
    </PageTransition>
  );
}

function ViewToggle({ active, onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full transition-colors duration-300',
        active ? 'bg-ink text-white' : 'text-ink-400 hover:text-ink'
      )}
    >
      {children}
    </button>
  );
}
