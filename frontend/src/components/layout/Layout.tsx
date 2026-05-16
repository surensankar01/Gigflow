import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export default function Layout() {
  const { user, clearAuth } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dynamic">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-dynamic"
        style={{ background: 'var(--sidebar-gradient)' }}>

        {/* Logo */}
        <div className="px-5 py-6 border-b border-dynamic">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
              <Zap size={17} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-dynamic tracking-tight text-base">GigFlow</span>
              <div className="text-[10px] text-dynamic-muted -mt-0.5 font-medium tracking-wider uppercase">Leads Dashboard</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'text-brand-600 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-surface-hover'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl"
                      style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.2)' }} />
                  )}
                  <Icon
                    size={16}
                    className={clsx(
                      'flex-shrink-0 transition-colors relative z-10',
                      isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                    )}
                  />
                  <span className="flex-1 relative z-10">{label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 relative z-10" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 pb-5 border-t border-dynamic pt-4">
          <div className="rounded-xl p-3 mb-2 bg-dynamic-card border border-dynamic flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.25)' }}>
                <span className="text-brand-500 dark:text-brand-400 font-bold text-xs">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-dynamic truncate">{user?.name}</div>
                <div className="text-[10px] text-dynamic-muted uppercase tracking-wider font-medium capitalize">{user?.role}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-dynamic pt-3">
               <span className="text-xs text-dynamic-muted font-medium">Theme</span>
               <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-surface-hover transition-colors"
                  title="Toggle Theme"
               >
                 {isDark ? <Sun size={15} /> : <Moon size={15} />}
               </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-500
                       hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-dynamic">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
