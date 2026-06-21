import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle, MessageSquare, Star, Circle, LogOut } from 'lucide-react';
import { ADMIN_NAV_LINKS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';
import { cn } from '../../lib/format';

const ICONS = { LayoutDashboard, Car, PlusCircle, MessageSquare, Star };

export default function AdminSidebar({ onNavigate }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-full flex-col bg-ink-900 text-white">
      <div className="flex items-center justify-between px-6 py-6">
        <Logo light chip size="sm" />
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = ICONS[link.icon] || Circle;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-white/10 text-white shadow-[inset_3px_0_0_0_#D81E2C]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-semibold">
            {(user?.name || 'A')[0]}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-white/40">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.9} />
          Sign out
        </button>
      </div>
    </div>
  );
}
