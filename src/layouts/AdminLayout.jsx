import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Drawer from '../components/ui/Drawer';
import { ToastProvider } from '../contexts/ToastContext';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
    <div className="min-h-screen bg-mist-200">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer sidebar */}
      <Drawer open={open} onClose={() => setOpen(false)} side="left" title="Menu" width="max-w-[80vw]">
        <AdminSidebar onNavigate={() => setOpen(false)} />
      </Drawer>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-white/90 px-5 py-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-xl bg-ink-50 text-ink"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold text-ink">Car Japan Admin</span>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
