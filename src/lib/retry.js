/** Pause execution — used between fetch retries. */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Whether a failed request should be retried (cold starts, network blips, 5xx).
 * 4xx client errors are not retried except timeout / rate-limit.
 */
export function isRetryableError(err) {
  if (!err) return false;
  const status = err.status ?? err.response?.status;
  if (status == null) return true; // network / timeout / CORS
  if (status === 408 || status === 429) return true;
  return status >= 500;
}

/**
 * Run an async function with automatic retries.
 * @param {() => Promise<T>} fn
 * @param {{ retries?: number, delay?: number, isRetryable?: (err: unknown) => boolean }} options
 * @returns {Promise<T>}
 */
export async function withRetry(fn, { retries = 3, delay = 2000, isRetryable = isRetryableError } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries && isRetryable(err)) {
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
