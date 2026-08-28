import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Phone,
  HomeIcon, CloudSun, ClipboardCheck, HeartPulse,
  PhoneCall, PlayCircle, Newspaper, Info,
} from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { to: '/', label: 'Beranda', icon: HomeIcon },
  { to: '/cuaca', label: 'Info Cuaca', icon: CloudSun },
  { to: '/checklist', label: 'Checklist', icon: ClipboardCheck },
  { to: '/pertolongan-pertama', label: 'Pertolongan Pertama', icon: HeartPulse },
  { to: '/nomor-darurat', label: 'Nomor Darurat', icon: PhoneCall },
  { to: '/video', label: 'Video Edukasi', icon: PlayCircle },
  { to: '/berita', label: 'Berita', icon: Newspaper },
  { to: '/tentang', label: 'Tentang', icon: Info },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 font-header transition-all duration-300 ${
        scrolled ? 'glass shadow-sm border-b border-ink-100' : 'bg-white'
      }`}
    >
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/nomor-darurat"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-accent-500/30 transition-all hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/40"
            >
              <Phone className="h-4 w-4" />
              Darurat
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-50 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-ink-100 bg-white animate-fade-in">
          <nav className="container-app flex flex-col gap-1 py-4">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/nomor-darurat"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" />
              Panggilan Darurat
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
