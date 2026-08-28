import { Navigate, Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Phone, LogOut, ExternalLink, Menu, X, Image as ImageIcon, Video, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero Banner', icon: ImageIcon },
  { to: '/admin/video', label: 'Video Edukasi', icon: Video },
  { to: '/admin/checklist', label: 'Checklist Keselamatan', icon: CheckSquare },
  { to: '/admin/berita', label: 'Berita', icon: Newspaper },
  { to: '/admin/nomor-darurat', label: 'Nomor Darurat', icon: Phone },
];

export default function AdminLayout() {
  const { session, loading, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-ink-50/40">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-ink-100 px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-ink-100 p-4">
          <Link to="/" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 hover:text-ink-900">
            <ExternalLink className="h-5 w-5" />
            Lihat Situs
          </Link>
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 lg:hidden">
        <Logo />
        <button onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-50">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {open && (
        <div className="border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
          <nav className="space-y-1">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-ink-50'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {n.label}
                </NavLink>
              );
            })}
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50">
              <ExternalLink className="h-5 w-5" /> Lihat Situs
            </Link>
            <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
              <LogOut className="h-5 w-5" /> Keluar
            </button>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="lg:pl-64">
        <div className="hidden items-center justify-between border-b border-ink-100 bg-white px-8 py-4 lg:flex">
          <div>
            <p className="text-xs font-medium text-ink-500">Dashboard Admin SIKEMAS</p>
            <p className="text-sm font-bold text-ink-900">{user?.email}</p>
          </div>
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-200">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
