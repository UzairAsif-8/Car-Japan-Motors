import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import Input, { Textarea } from './ui/Input';
import { CONTACT, buildWhatsAppLink } from '../constants';
import { createInquiry } from '../services/inquiryService';
import { formatPrice, cn } from '../lib/format';

/** Sticky price + inquiry panel for the vehicle details page. */
export default function PriceCard({ car }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      message: `I'm interested in the ${car.name} (${car.year}). Please share more details.`,
    },
  });

  const waMessage = `Hi Car Japan, I'm interested in the ${car.name} (${car.year}) listed at ${formatPrice(
    car.price
  )}. Is it still available?`;

  const onSubmit = async (values) => {
    await createInquiry({
      ...values,
      carId: car._id,
      carName: car.name,
    });
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
      <div className="border-b border-ink-100 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Asking Price</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="font-display text-4xl font-extrabold tracking-tight text-ink">
            {formatPrice(car.price)}
          </p>
          <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ShieldCheck className="h-4 w-4" /> Inspected
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-400">Inclusive of transfer assistance.</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            href={buildWhatsAppLink(waMessage)}
            target="_blank"
            rel="noreferrer"
            variant="whatsapp"
            icon={MessageCircle}
            fullWidth
          >
            WhatsApp
          </Button>
          <Button href={CONTACT.phoneHref} variant="dark" icon={Phone} fullWidth>
            Call Now
          </Button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg font-bold text-ink">Request a callback</h3>
        <p className="mt-1 text-sm text-ink-400">We typically respond within minutes.</p>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-8 text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <div>
                <p className="font-display text-lg font-bold text-ink">Inquiry received</p>
                <p className="mt-1 text-sm text-ink-500">
                  Thank you. Our team will reach out shortly.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 space-y-3"
            >
              <Input
                placeholder="Your name"
                error={errors.name?.message}
                {...register('name', { required: 'Please enter your name' })}
              />
              <Input
                placeholder="Phone number"
                type="tel"
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'Please enter your phone number',
                  minLength: { value: 7, message: 'Enter a valid number' },
                })}
              />
              <Textarea
                rows={3}
                placeholder="Message"
                {...register('message')}
              />
              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                  </>
                ) : (
                  'Send Inquiry'
                )}
              </Button>
              <p className="text-center text-xs text-ink-400">
                By submitting you agree to our{' '}
                <a href="/privacy" className="underline hover:text-ink">
                  privacy policy
                </a>
                .
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SpecPill({ icon: Icon, label, value, className }) {
  return (
    <div className={cn('rounded-2xl border border-ink-100 bg-white p-4', className)}>
      <Icon className="h-5 w-5 text-brand" strokeWidth={1.8} />
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
      <p className="mt-0.5 font-semibold text-ink">{value}</p>
    </div>
  );
}
