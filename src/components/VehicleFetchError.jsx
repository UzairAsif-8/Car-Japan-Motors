import { CloudOff, Loader2, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '../lib/format';

export const VEHICLE_WAKE_UP_MESSAGE =
  "We're waking up the server. Please wait a few seconds and try again.";

export const VEHICLE_EMPTY_MESSAGE = 'No vehicles added currently.';

/**
 * Shown when vehicle fetches fail after all automatic retries.
 */
export default function VehicleFetchError({
  message = VEHICLE_WAKE_UP_MESSAGE,
  onRetry,
  retrying = false,
  className,
  compact = false,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-mist-100 px-6 text-center',
        compact ? 'py-12' : 'py-20',
        className
      )}
      role="alert"
    >
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-ink-400 shadow-soft">
        {retrying ? (
          <Loader2 className="h-8 w-8 animate-spin" strokeWidth={1.5} />
        ) : (
          <CloudOff className="h-8 w-8" strokeWidth={1.5} />
        )}
      </span>
      <h3 className="mt-6 font-display text-xl font-bold text-ink">
        {retrying ? 'Connecting to server…' : 'Unable to load vehicles'}
      </h3>
      <p className="mt-2 max-w-md text-ink-500">{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-6"
          icon={retrying ? Loader2 : RefreshCw}
          disabled={retrying}
          onClick={onRetry}
        >
          {retrying ? 'Retrying…' : 'Try again'}
        </Button>
      )}
    </div>
  );
}
