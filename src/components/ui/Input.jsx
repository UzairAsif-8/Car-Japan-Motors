import { forwardRef } from 'react';
import { cn } from '../../lib/format';

const baseField =
  'w-full rounded-2xl border border-ink-100 bg-white text-ink placeholder:text-ink-300 ' +
  'transition-all duration-300 ease-smooth focus:border-ink-900 focus:ring-4 focus:ring-ink-900/5 ' +
  'outline-none disabled:bg-mist-200 disabled:cursor-not-allowed';

export const Field = ({ label, hint, error, required, children, className }) => (
  <label className={cn('block', className)}>
    {label && (
      <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-ink-700">
        {label}
        {required && <span className="text-brand">*</span>}
      </span>
    )}
    {children}
    {error ? (
      <span className="mt-1.5 block text-xs font-medium text-brand">{error}</span>
    ) : hint ? (
      <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>
    ) : null}
  </label>
);

const Input = forwardRef(function Input(
  { label, hint, error, required, icon: Icon, className, wrapperClassName, ...props },
  ref
) {
  const field = (
    <div className="relative">
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300"
          strokeWidth={1.8}
        />
      )}
      <input
        ref={ref}
        className={cn(
          baseField,
          'h-12 px-4 text-[15px]',
          Icon && 'pl-12',
          error && 'border-brand/60 focus:border-brand focus:ring-brand/10',
          className
        )}
        {...props}
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

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, required, className, wrapperClassName, rows = 4, ...props },
  ref
) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={wrapperClassName}>
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          baseField,
          'px-4 py-3 text-[15px] resize-none',
          error && 'border-brand/60 focus:border-brand focus:ring-brand/10',
          className
        )}
        {...props}
      />
    </Field>
  );
});

export default Input;
