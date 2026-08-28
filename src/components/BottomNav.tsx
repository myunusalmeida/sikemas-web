import { Link, useLocation } from 'react-router-dom';
import { Home, Cloud, CheckSquare, Heart, Phone } from 'lucide-react';

const items = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/cuaca', label: 'Cuaca', icon: Cloud },
  { to: '/checklist', label: 'Checklist', icon: CheckSquare },
  { to: '/pertolongan-pertama', label: 'P3K', icon: Heart },
  { to: '/nomor-darurat', label: 'Darurat', icon: Phone, urgent: true },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="glass border-t border-ink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-stretch justify-around px-2 py-1.5">
          {items.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold transition-colors ${
                  active
                    ? item.urgent
                      ? 'text-accent-600'
                      : 'text-primary-700'
                    : 'text-ink-500'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    active
                      ? item.urgent
                        ? 'bg-accent-100'
                        : 'bg-primary-100'
                      : ''
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
                </div>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
