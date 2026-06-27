import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Trash2, Plus, Loader2, Quote } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Input, { Textarea } from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Image from '../../components/ui/Image';
import { Skeleton } from '../../components/ui/Skeleton';
import useAsync from '../../hooks/useAsync';
import { getAllReviews, createReview, deleteReview } from '../../services/reviewService';
import { cn } from '../../lib/format';
import { useToast } from '../../contexts/ToastContext';

export default function Reviews() {
  const { showSuccess, showError } = useToast();
  const { data, loading } = useAsync(() => getAllReviews(), []);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (data) setReviews(data);
  }, [data]);

  const onSubmit = async (values) => {
    try {
      const created = await createReview({ ...values, rating });
      setReviews((prev) => [created, ...prev]);
      reset();
      setRating(5);
      showSuccess('Review published successfully.');
    } catch (err) {
      showError(err.message || 'Failed to publish review.');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteReview(toDelete.id);
      setReviews((prev) => prev.filter((r) => r.id !== toDelete.id));
      setToDelete(null);
      showSuccess('Review deleted successfully.');
    } catch (err) {
      showError(err.message || 'Failed to delete review.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Reviews</h1>
          <p className="mt-1 text-ink-500">
            Add customer reviews — they appear instantly on the homepage testimonials.
          </p>
        </div>
        <span className="rounded-full border border-ink-100 bg-white px-4 py-2 text-sm font-semibold text-ink-600">
          {reviews.length} published
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Add review form */}
        <section className="h-fit rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Plus className="h-5 w-5 text-brand" /> Add a review
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input
              label="Customer name"
              required
              placeholder="e.g. Ahmed Raza"
              error={errors.name?.message}
              {...register('name', { required: 'Required' })}
            />
            <Input
              label="Role / Location"
              placeholder="e.g. Business Owner, Lahore"
              {...register('role')}
            />
            <Input
              label="Avatar URL"
              placeholder="https://… (optional)"
              hint="Leave blank to use initials."
              {...register('avatar')}
            />

            <div>
              <span className="mb-2 block text-sm font-semibold text-ink-700">Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        'h-7 w-7 transition-colors',
                        n <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-ink-200'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Review"
              required
              rows={4}
              placeholder="What did the customer say?"
              error={errors.quote?.message}
              {...register('quote', { required: 'Please write the review' })}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              icon={isSubmitting ? undefined : Plus}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Publishing…
                </>
              ) : (
                'Publish Review'
              )}
            </Button>
          </form>
        </section>

        {/* Existing reviews */}
        <section>
          {loading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : (
            <AdminTable
              keyField="id"
              data={reviews}
              empty="No reviews yet. Add your first one."
              columns={[
                {
                  key: 'name',
                  header: 'Customer',
                  render: (r) => (
                    <div className="flex items-center gap-3">
                      {r.avatar ? (
                        <Image src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full" imgClassName="rounded-full" />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-sm font-bold text-ink-600">
                          {(r.name || '?')[0]}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-ink">{r.name}</p>
                        <p className="text-xs text-ink-400">{r.role}</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'rating',
                  header: 'Rating',
                  render: (r) => (
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating || 0 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'quote',
                  header: 'Review',
                  render: (r) => (
                    <span className="line-clamp-2 max-w-md text-ink-500">
                      <Quote className="mr-1 inline h-3.5 w-3.5 text-ink-300" />
                      {r.quote}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  header: '',
                  align: 'right',
                  render: (r) => (
                    <button
                      onClick={() => setToDelete(r)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  ),
                },
              ]}
            />
          )}
        </section>
      </div>

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} label="Confirm delete">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-ink">Delete this review?</h3>
        <p className="mt-2 text-ink-500">
          The review from {toDelete?.name} will be removed from the homepage. This cannot be undone.
        </p>
        <div className="mt-7 flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setToDelete(null)}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth loading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
