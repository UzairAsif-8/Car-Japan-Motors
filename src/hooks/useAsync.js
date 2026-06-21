import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic async-data hook with loading/error/data states.
 * `deps` controls when the fetcher re-runs. Guards against state updates
 * after unmount and against out-of-order responses.
 */
export default function useAsync(asyncFn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const callId = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    const id = ++callId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (mounted.current && id === callId.current) setData(result);
      return result;
    } catch (err) {
      if (mounted.current && id === callId.current) setError(err);
      throw err;
    } finally {
      if (mounted.current && id === callId.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) run().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}
