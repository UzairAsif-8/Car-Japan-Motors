import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  Pencil,
  Eye,
  EyeOff,
  Shield,
  User,
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { changeEmail, changePassword } from '../../services/accountService';

function Panel({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mist-100 text-ink-600">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Settings() {
  const { user, bootstrapping, updateSession } = useAuth();
  const { showSuccess, showError } = useToast();
  const [editingEmail, setEditingEmail] = useState(false);
  const [showCurrentPwEmail, setShowCurrentPwEmail] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const emailForm = useForm({
    defaultValues: { currentPassword: '', currentEmail: '', newEmail: '' },
  });

  const passwordForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    formState: { errors: emailErrors, isSubmitting: emailSubmitting },
  } = emailForm;

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = passwordForm;

  const newPasswordValue = watchPassword('newPassword');

  const onEmailSubmit = async (values) => {
    try {
      const result = await changeEmail({
        currentEmail: values.currentEmail,
        newEmail: values.newEmail,
        currentPassword: values.currentPassword,
      });
      updateSession({
        token: result.token,
        user: { id: user?.id, email: result.data.email },
      });
      resetEmail();
      setEditingEmail(false);
      showSuccess(result.message || 'Email updated successfully.');
    } catch (err) {
      showError(err.message);
    }
  };

  const onPasswordSubmit = async (values) => {
    try {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (result.token) {
        updateSession({ token: result.token });
      }
      resetPassword();
      showSuccess(result.message || 'Password updated successfully.');
    } catch (err) {
      showError(err.message);
    }
  };

  const cancelEmailEdit = () => {
    resetEmail();
    setEditingEmail(false);
  };

  if (bootstrapping) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-ink-500">Manage your admin account email and password.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <Panel
          title="Account Information"
          description="Your login email for the admin dashboard."
          icon={User}
        >
          {!editingEmail ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-ink-100 bg-mist-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Email</p>
                <p className="mt-1 flex items-center gap-2 text-[15px] font-medium text-ink">
                  <Mail className="h-4 w-4 text-ink-400" />
                  {user?.email || '—'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                icon={Pencil}
                onClick={() => {
                  resetEmail({
                    currentPassword: '',
                    currentEmail: user?.email || '',
                    newEmail: '',
                  });
                  setEditingEmail(true);
                }}
              >
                Edit Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  label="Current password"
                  icon={Lock}
                  type={showCurrentPwEmail ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={emailErrors.currentPassword?.message}
                  {...registerEmail('currentPassword', { required: 'Current password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwEmail((v) => !v)}
                  className="absolute right-4 top-[42px] text-ink-400 transition-colors hover:text-ink"
                  aria-label={showCurrentPwEmail ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPwEmail ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <Input
                label="Current email"
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder="Enter current email"
                error={emailErrors.currentEmail?.message}
                {...registerEmail('currentEmail', {
                  required: 'Current email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              <Input
                label="New email"
                icon={Mail}
                type="email"
                autoComplete="off"
                placeholder="Enter new email"
                error={emailErrors.newEmail?.message}
                {...registerEmail('newEmail', {
                  required: 'New email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                  validate: (value, formValues) =>
                    value.toLowerCase().trim() !== formValues.currentEmail?.toLowerCase().trim() ||
                    'New email must be different from your current email',
                })}
              />
              <div className="flex flex-wrap gap-3 pt-1">
                <Button type="submit" loading={emailSubmitting} disabled={emailSubmitting}>
                  Update Email
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelEmailEdit}
                  disabled={emailSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Panel>

        {/* Security */}
        <Panel
          title="Security"
          description="Change your password. You will stay signed in after updating."
          icon={Shield}
        >
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="Current password"
                type={showCurrentPw ? 'text' : 'password'}
                autoComplete="current-password"
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw((v) => !v)}
                className="absolute right-4 top-[42px] text-ink-400 transition-colors hover:text-ink"
                aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
              >
                {showCurrentPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="New password"
                type={showNewPw ? 'text' : 'password'}
                autoComplete="new-password"
                hint="Minimum 8 characters"
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="absolute right-4 top-[42px] text-ink-400 transition-colors hover:text-ink"
                aria-label={showNewPw ? 'Hide password' : 'Show password'}
              >
                {showNewPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="Confirm new password"
                type={showConfirmPw ? 'text' : 'password'}
                autoComplete="new-password"
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === newPasswordValue || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw((v) => !v)}
                className="absolute right-4 top-[42px] text-ink-400 transition-colors hover:text-ink"
                aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
              >
                {showConfirmPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="pt-1">
              <Button type="submit" loading={passwordSubmitting} disabled={passwordSubmitting}>
                <Lock className="h-5 w-5" /> Change Password
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
