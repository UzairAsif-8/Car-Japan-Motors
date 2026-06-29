import { useCallback, useEffect, useRef, useState } from 'react';
import { sleep, isRetryableError } from '../lib/retry';

/**
 * Generic async-data hook with loading / error / data states.
 * `deps` controls when the fetcher re-runs. Guards against state updates
 * after unmount and against out-of-order responses.
 *
 * Options:
 *   - retries: extra attempts after the first failure (default 0)
 *   - retryDelay: ms between retries (default 2000)
 *   - isRetryable: predicate for whether to retry (default: network + 5xx)
 */
export default function useAsync(asyncFn, deps = [], options = {}) {
  const {
    immediate = true,
    retries = 0,
    retryDelay = 2000,
    isRetryable = isRetryableError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const mounted = useRef(true);
  const callId = useRef(0);
  const asyncFnRef = useRef(asyncFn);
  const optionsRef = useRef({ retries, retryDelay, isRetryable });

  asyncFnRef.current = asyncFn;
  optionsRef.current = { retries, retryDelay, isRetryable };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    const id = ++callId.current;
    const { retries: maxRetries, retryDelay: delay, isRetryable: canRetry } = optionsRef.current;

    setLoading(true);
    setError(null);
    setIsRetrying(false);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (!mounted.current || id !== callId.current) return;

      if (attempt > 0) setIsRetrying(true);

      try {
        const result = await asyncFnRef.current();
        if (mounted.current && id === callId.current) {
          setData(result);
          setError(null);
          setIsRetrying(false);
          setLoading(false);
        }
        return result;
      } catch (err) {
        const shouldRetry = attempt < maxRetries && canRetry(err);
        if (shouldRetry) {
          await sleep(delay);
          continue;
        }
        if (mounted.current && id === callId.current) {
          setError(err);
          setIsRetrying(false);
          setLoading(false);
        }
        throw err;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) run().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, loading, error, isRetrying, refetch: run, setData };
}
