import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const KEYS = ['search', 'make', 'model', 'year', 'transmission', 'fuel', 'bodyType', 'minPrice', 'maxPrice', 'sort', 'status'];

const emptyFilters = KEYS.reduce((acc, k) => ({ ...acc, [k]: '' }), {});

/**
 * Reads/writes inventory filters to the URL query string. This keeps filter
 * state shareable, back-button friendly, and decoupled from component state.
 */
export default function useInventoryFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => {
    const next = { ...emptyFilters };
    for (const key of KEYS) {
      const value = params.get(key);
      if (value != null) next[key] = value;
    }
    return next;
  }, [params]);

  const setFilters = (updates) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) {
      if (value === '' || value == null) next.delete(key);
      else next.set(key, value);
    }
    next.delete('page');
    setParams(next, { replace: true });
  };

  const resetFilters = () => {
    const next = new URLSearchParams();
    if (params.get('sort')) next.set('sort', params.get('sort'));
    if (params.get('status')) next.set('status', params.get('status'));
    setParams(next, { replace: true });
  };

  // Normalise to the shape the service expects (numbers where relevant).
  const queryParams = useMemo(() => {
    const q = {};
    for (const key of KEYS) {
      if (!filters[key]) continue;
      if (key === 'minPrice' || key === 'maxPrice') q[key] = Number(filters[key]);
      else q[key] = filters[key];
    }
    return q;
  }, [filters]);

  return { filters, setFilters, resetFilters, queryParams };
}
