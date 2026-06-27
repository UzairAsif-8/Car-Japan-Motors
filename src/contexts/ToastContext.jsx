import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const dismissToast = useCallback(() => setToast(null), []);

  const showToast = useCallback((messageOrOptions, type = 'success') => {
    const next =
      typeof messageOrOptions === 'string'
        ? { type, message: messageOrOptions }
        : messageOrOptions;
    setToast(next);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      showSuccess: (message) => showToast({ type: 'success', message }),
      showError: (message) => showToast({ type: 'error', message }),
      dismissToast,
    }),
    [showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toast={toast} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
