import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import Button from './ui/Button';
import { MAKES, TRANSMISSIONS, YEARS, PRICE_BOUNDS } from '../constants';
import { formatPrice, cn } from '../lib/format';

const priceOptions = [
  { value: '', label: 'Any Price' },
  { value: '0-4000000', label: `Under ${formatPrice(4000000)}` },
  { value: '4000000-7000000', label: `${formatPrice(4000000)} – ${formatPrice(7000000)}` },
  { value: '7000000-12000000', label: `${formatPrice(7000000)} – ${formatPrice(12000000)}` },
  { value: `12000000-${PRICE_BOUNDS.max}`, label: `Above ${formatPrice(12000000)}` },
];

/**
 * Elegant, glass inventory search used on the hero. Builds a query string and
 * routes to /inventory — the inventory page reads it back from the URL.
 */
export default function SearchBar({ className }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ search: '', make: '', year: '', price: '', transmission: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.search) params.set('search', form.search);
    if (form.make) params.set('make', form.make);
    if (form.year) params.set('year', form.year);
    if (form.transmission) params.set('transmission', form.transmission);
    if (form.price) {
      const [min, max] = form.price.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-[28px] border border-white/60 bg-white/95 p-3 shadow-elevated backdrop-blur-xl',
        className
      )}
    >
      <div className="flex items-center gap-2 rounded-2xl px-4 py-2">
        <Search className="h-5 w-5 shrink-0 text-ink-400" />
        <input
          value={form.search}
          onChange={update('search')}
          placeholder="Search by make, model or keyword…"
          className="h-11 w-full bg-transparent text-[15px] text-ink placeholder:text-ink-400 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-ink-100 pt-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <PillSelect value={form.make} onChange={update('make')} placeholder="Any Make" options={MAKES} />
        <PillSelect
          value={form.year}
          onChange={update('year')}
          placeholder="Any Year"
          options={YEARS.map((y) => ({ value: y, label: y }))}
        />
        <PillSelect
          value={form.transmission}
          onChange={update('transmission')}
          placeholder="Any Transmission"
          options={TRANSMISSIONS}
          className="hidden lg:block"
        />
        <PillSelect
          value={form.price}
          onChange={update('price')}
          options={priceOptions}
          className="lg:hidden"
        />
        <Button type="submit" size="lg" icon={Search} className="col-span-2 lg:col-span-1">
          Search
        </Button>
      </div>
    </motion.form>
  );
}

function PillSelect({ value, onChange, placeholder, options = [], className }) {
  const normalized = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        className="h-12 w-full appearance-none rounded-2xl bg-mist-200 pl-4 pr-9 text-sm font-semibold text-ink-700 outline-none transition-colors hover:bg-mist-300 focus:ring-2 focus:ring-ink-900/10"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  );
}
