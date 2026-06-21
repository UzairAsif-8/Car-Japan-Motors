import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: 'admin@carjapan.pk', password: 'carjapan' } });

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  const onSubmit = async (values) => {
    setAuthError('');
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 lg:flex">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <Logo size="admin" chip />
        <div className="relative">
          <ShieldCheck className="h-10 w-10 text-brand-300" />
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white">
            Car Japan
            <br />
            Management Suite
          </h1>
          <p className="mt-4 max-w-sm text-white/60">
            Manage your inventory, respond to customer inquiries and keep your
            showroom running beautifully.
          </p>
        </div>
        <p className="relative text-sm text-white/40">© {new Date().getFullYear()} Car Japan. Internal use only.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="admin" chip />
          </div>
          <h2 className="font-display text-3xl font-bold text-ink">Welcome back</h2>
          <p className="mt-2 text-ink-500">Sign in to access your dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Input
              label="Email address"
              icon={Mail}
              type="email"
              placeholder="admin@carjapan.pk"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <div className="relative">
              <Input
                label="Password"
                icon={Lock}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-4 top-[42px] text-ink-400 transition-colors hover:text-ink"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {authError && (
              <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-600">
                {authError}
              </p>
            )}

            <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-ink-100 bg-mist-100 px-4 py-3 text-sm text-ink-500">
            <span className="font-semibold text-ink-700">Demo credentials:</span> admin@carjapan.pk / carjapan
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
