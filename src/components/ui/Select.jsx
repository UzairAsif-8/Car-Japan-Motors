import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Field } from './Input';
import { cn } from '../../lib/format';

/**
 * Styled native select — accessible, mobile-friendly, and consistent with the
 * rest of the form system. `options` accepts strings or {value,label} objects.
 */
const Select = forwardRef(function Select(
  { label, hint, error, required, placeholder, options = [], className, wrapperClassName, ...props },
  ref
) {
  const normalized = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const field = (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-12 w-full appearance-none rounded-2xl border border-ink-100 bg-white pl-4 pr-11 text-[15px] text-ink',
          'transition-all duration-300 ease-smooth focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5 outline-none',
          'disabled:bg-mist-200 disabled:cursor-not-allowed',
          error && 'border-brand/60 focus:border-brand focus:ring-brand/10',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400"
        strokeWidth={1.8}
      />
    </div>
  );

  if (!label && !hint && !error) return field;
  return (
    <Field label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      {field}
    </Field>
  );
});

export default Select;
