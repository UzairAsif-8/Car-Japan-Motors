import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, X, ImagePlus, UploadCloud } from 'lucide-react';
import Input, { Textarea } from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { getCarById, createCar, updateCar } from '../../services/carService';
import { MAKES, TRANSMISSIONS, FUEL_TYPES, BODY_TYPES, YEARS, CAR_STATUS_OPTIONS, CAR_STATUS } from '../../constants';
import { useToast } from '../../contexts/ToastContext';

const blankCar = {
  make: '', customMake: '', model: '', variant: '', year: '', price: '', mileage: '',
  transmission: '', fuel: '', bodyType: '', engine: '', color: '',
  registration: '', drivetrain: '', seats: '', condition: 'Local',
  featured: false, status: CAR_STATUS.AVAILABLE, description: '',
};

// Sentinel value for the "add a make that isn't in the list" option.
const CUSTOM_MAKE = '__custom__';

export default function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  // Each item: { url, file }. file === null for existing/pasted URLs.
  const [media, setMedia] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: blankCar });

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    getCarById(id)
      .then((car) => {
        if (!active) return;
        reset({ ...blankCar, ...car, featured: car.featured, status: car.status || CAR_STATUS.AVAILABLE });
        // If the saved make isn't in the preset list, treat it as a custom make.
        if (car.make && !MAKES.includes(car.make)) {
          setValue('make', CUSTOM_MAKE);
          setValue('customMake', car.make);
        }
        setMedia((car.images || []).map((url) => ({ url, file: null })));
        setHighlights(car.highlights || []);
      })
      .catch(() => navigate('/admin/cars'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, isEdit, reset, navigate, setValue]);

  const addImage = (url) => {
    const value = (url || '').trim();
    if (value) setMedia((prev) => [...prev, { url: value, file: null }]);
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      setMedia((prev) => [...prev, { url: URL.createObjectURL(file), file }]);
    });
  };

  // Paste a copied image anywhere on the form (Ctrl/Cmd + V) — e.g. a
  // screenshot or an image copied from another tab. Text paste is untouched.
  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const images = [];
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) images.push(file);
        }
      }
      if (images.length) {
        e.preventDefault();
        handleFiles(images);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const addHighlight = () => {
    const value = highlightInput.trim();
    if (value) {
      setHighlights((prev) => [...prev, value]);
      setHighlightInput('');
    }
  };

  const onSubmit = async (values) => {
    // Resolve a custom make typed by the admin into the real make value.
    const make =
      values.make === CUSTOM_MAKE ? (values.customMake || '').trim() : values.make;
    const payload = {
      ...values,
      make,
      name: `${make} ${values.model}`.trim(),
      year: Number(values.year),
      price: Number(values.price),
      mileage: Number(values.mileage),
      seats: Number(values.seats),
      // Kept/pasted URLs vs newly-uploaded files (sent as multipart in live mode).
      images: media.map((m) => m.url),
      imageUrls: media.filter((m) => !m.file).map((m) => m.url),
      imageFiles: media.filter((m) => m.file).map((m) => m.file),
      highlights,
      customMake: undefined,
    };
    try {
      if (isEdit) {
        await updateCar(id, payload);
        showSuccess('Vehicle updated successfully.');
      } else {
        await createCar(payload);
        showSuccess('Vehicle created successfully.');
      }
      navigate('/admin/cars', { replace: !isEdit });
    } catch (err) {
      showError(err.message || 'Failed to save vehicle.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const makeValue = watch('make');
  const makeOptions = [...MAKES, { value: CUSTOM_MAKE, label: '+ Add custom make…' }];

  return (
    <div>
      <Link
        to="/admin/cars"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to vehicles
      </Link>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink">
        {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
      </h1>
      <p className="mt-1 text-ink-500">
        {isEdit ? 'Update the details for this listing.' : 'Create a new listing for your inventory.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basics */}
          <Panel title="Vehicle details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Select label="Make" required placeholder="Select make" options={makeOptions}
                error={errors.make?.message} {...register('make', { required: 'Required' })} />
              {makeValue === CUSTOM_MAKE && (
                <Input label="Custom make" required placeholder="e.g. Daihatsu"
                  error={errors.customMake?.message}
                  {...register('customMake', { required: 'Enter the make' })} />
              )}
              <Input label="Model" required placeholder="e.g. Corolla"
                error={errors.model?.message} {...register('model', { required: 'Required' })} />
              <Input label="Variant" placeholder="e.g. Altis Grande 1.8" {...register('variant')} />
              <Select label="Year" required placeholder="Select year"
                options={YEARS.map((y) => ({ value: y, label: y }))}
                error={errors.year?.message} {...register('year', { required: 'Required' })} />
              <Select label="Body Type" required placeholder="Select type" options={BODY_TYPES}
                error={errors.bodyType?.message} {...register('bodyType', { required: 'Required' })} />
              <Input label="Color" placeholder="e.g. Pearl White" {...register('color')} />
            </div>
          </Panel>

          {/* Specs */}
          <Panel title="Specifications">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Engine" placeholder="e.g. 1.8L 4-Cylinder" {...register('engine')} />
              <Select label="Transmission" required placeholder="Select" options={TRANSMISSIONS}
                error={errors.transmission?.message} {...register('transmission', { required: 'Required' })} />
              <Select label="Fuel Type" required placeholder="Select" options={FUEL_TYPES}
                error={errors.fuel?.message} {...register('fuel', { required: 'Required' })} />
              <Input label="Drivetrain" placeholder="e.g. FWD / 4WD" {...register('drivetrain')} />
              <Input label="Seats" type="number" placeholder="5" {...register('seats')} />
              <Input label="Registration" placeholder="e.g. Lahore" {...register('registration')} />
              <Input label="Mileage (km)" required type="number" placeholder="21000"
                error={errors.mileage?.message} {...register('mileage', { required: 'Required' })} />
              <Input label="Price (PKR)" required type="number" placeholder="7250000"
                error={errors.price?.message} {...register('price', { required: 'Required' })} />
            </div>
          </Panel>

          {/* Description */}
          <Panel title="Description & highlights">
            <Textarea label="Description" rows={4} placeholder="A short, elegant description…" {...register('description')} />

            <div className="mt-5">
              <span className="mb-2 block text-sm font-semibold text-ink-700">Highlights</span>
              <div className="flex gap-2">
                <input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  placeholder="e.g. Sunroof"
                  className="h-11 flex-1 rounded-xl border border-ink-100 px-4 text-sm outline-none focus:border-ink-900"
                />
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                  Add
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-mist-200 px-3 py-1.5 text-sm font-medium text-ink-700">
                    {h}
                    <button type="button" onClick={() => setHighlights((p) => p.filter((_, idx) => idx !== i))}>
                      <X className="h-3.5 w-3.5 text-ink-400 hover:text-brand" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Panel title="Photos">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-mist-100 px-4 py-8 text-center transition-colors hover:border-brand hover:bg-brand-50/40">
              <UploadCloud className="h-8 w-8 text-ink-300" />
              <span className="mt-3 text-sm font-semibold text-ink">Click to upload photos</span>
              <span className="mt-1 text-xs text-ink-400">PNG or JPG · up to 20 images</span>
              <span className="mt-2 text-[11px] font-medium text-ink-400">
                or copy an image and press{' '}
                <kbd className="rounded bg-ink-100 px-1.5 py-0.5 font-sans text-[10px] text-ink-600">Ctrl</kbd>
                {' + '}
                <kbd className="rounded bg-ink-100 px-1.5 py-0.5 font-sans text-[10px] text-ink-600">V</kbd>
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            <div className="mt-4 flex gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), (addImage(imageInput), setImageInput('')))}
                placeholder="…or paste an image URL"
                className="h-11 flex-1 rounded-xl border border-ink-100 px-4 text-sm outline-none focus:border-ink-900"
              />
              <Button type="button" variant="outline" size="sm" icon={ImagePlus}
                onClick={() => { addImage(imageInput); setImageInput(''); }}>
                Add
              </Button>
            </div>

            {media.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {media.map((m, i) => (
                  <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-mist-200">
                    <img src={m.url} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setMedia((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Visibility">
            <label className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">Featured listing</p>
                <p className="text-sm text-ink-400">Show on the homepage</p>
              </div>
              <input type="checkbox" {...register('featured')} className="h-5 w-5 accent-brand" />
            </label>
            <Select label="Condition" placeholder="Select" options={['Local', 'Imported']} className="mt-4" {...register('condition')} />
            <Select
              label="Listing Status"
              required
              placeholder="Select status"
              options={CAR_STATUS_OPTIONS}
              className="mt-4"
              error={errors.status?.message}
              {...register('status', { required: 'Required' })}
            />
          </Panel>

          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}
            icon={isSubmitting ? undefined : Save}>
            {isSubmitting ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Saving…</>
            ) : isEdit ? 'Save Changes' : 'Create Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <h2 className="mb-5 font-display text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
