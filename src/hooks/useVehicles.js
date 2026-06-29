import useAsync from './useAsync';
import { isRetryableError } from '../lib/retry';

/** Default retry policy for vehicle reads — tuned for Render cold starts. */
export const VEHICLE_FETCH_OPTIONS = {
  retries: 3,
  retryDelay: 2000,
  isRetryable: isRetryableError,
};

/**
 * Fetch vehicle data with loading / error / data states and automatic retries.
 * Never conflates a failed request with an empty inventory.
 */
export default function useVehicles(asyncFn, deps = []) {
  return useAsync(asyncFn, deps, VEHICLE_FETCH_OPTIONS);
}
