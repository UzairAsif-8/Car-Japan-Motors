import Badge from './ui/Badge';
import { CAR_STATUS, STATUS_BADGE } from '../constants';

/** Listing status badge for admin tables and detail views. */
export default function StatusBadge({ status, className }) {
  const key = status || CAR_STATUS.AVAILABLE;
  const meta = STATUS_BADGE[key] || STATUS_BADGE[CAR_STATUS.AVAILABLE];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}
