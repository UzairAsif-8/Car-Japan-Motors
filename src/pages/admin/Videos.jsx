import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Youtube, Trash2, Plus, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import useAsync from '../../hooks/useAsync';
import { getVideos, createVideo, deleteVideo } from '../../services/videoService';
import { getYouTubeVideoId } from '../../lib/youtube';
import { formatDate } from '../../lib/format';

export default function Videos() {
  const { data, loading } = useAsync(() => getVideos(), []);
  const [videos, setVideos] = useState([]);
  const [saved, setSaved] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { url: '' } });

  useEffect(() => {
    if (data) setVideos(data);
  }, [data]);

  const onSubmit = async (values) => {
    const created = await createVideo(values.url);
    setVideos((prev) => [created, ...prev]);
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteVideo(toDelete.id);
      setVideos((prev) => prev.filter((v) => v.id !== toDelete.id));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">YouTube Videos</h1>
          <p className="mt-1 text-ink-500">
            Manage videos shown in the homepage carousel. Paste any standard YouTube link.
          </p>
        </div>
        <span className="rounded-full border border-ink-100 bg-white px-4 py-2 text-sm font-semibold text-ink-600">
          {videos.length} video{videos.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Plus className="h-5 w-5 text-brand" /> Add a video
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input
              label="YouTube URL"
              required
              placeholder="https://www.youtube.com/watch?v=…"
              error={errors.url?.message}
              {...register('url', {
                required: 'YouTube URL is required',
                validate: (value) =>
                  getYouTubeVideoId(value) ? true : 'Enter a valid YouTube URL',
              })}
            />
            <Button type="submit" fullWidth disabled={isSubmitting || saved} icon={saved ? CheckCircle2 : Youtube}>
              {saved ? 'Video added!' : isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</>
              ) : (
                'Add Video'
              )}
            </Button>
          </form>
        </section>

        <section>
          {loading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : (
            <AdminTable
              keyField="id"
              data={videos}
              empty="No videos yet. Add your first YouTube link."
              columns={[
                {
                  key: 'url',
                  header: 'Video URL',
                  render: (r) => (
                    <div className="max-w-md">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-brand hover:underline"
                      >
                        {r.url}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                      {r.videoId && (
                        <p className="mt-1 text-xs text-ink-400">ID: {r.videoId}</p>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'createdAt',
                  header: 'Added',
                  render: (r) => (
                    <span className="text-sm text-ink-500">
                      {r.createdAt ? formatDate(r.createdAt) : '—'}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  align: 'right',
                  render: (r) => (
                    <button
                      type="button"
                      onClick={() => setToDelete(r)}
                      className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-brand-50 hover:text-brand"
                      aria-label="Delete video"
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
        <h3 className="mt-5 font-display text-xl font-bold text-ink">Delete this video?</h3>
        <p className="mt-2 break-all text-ink-500">{toDelete?.url}</p>
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
