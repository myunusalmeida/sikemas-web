import { Link } from 'react-router-dom';
import { MapPin, Mail, Instagram, Facebook, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      <div className="container-app py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo light />
            </div>
            <p className="text-sm leading-relaxed text-ink-400">
              Sistem Informasi Keselamatan Melaut Pelabuhan Perikanan Kuala Tari.
              Melindungi nelayan, Menjaga keselamatan, Mewujudkan pelayaran yang aman
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Navigasi</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link to="/cuaca" className="hover:text-white transition-colors">Info Cuaca</Link></li>
              <li><Link to="/checklist" className="hover:text-white transition-colors">Checklist Keselamatan</Link></li>
              <li><Link to="/berita" className="hover:text-white transition-colors">Berita</Link></li>
              <li><Link to="/tentang" className="hover:text-white transition-colors">Tentang</Link></li>
            </ul>
          </div>

          

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Kontak</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span>Pelabuhan Perikanan Kuala Tari, Pidie</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                <span>pp.kualatari2022@gmail.com</span>
              </li>
            </ul>

            <h3 className="mb-4 mt-6 text-sm font-bold uppercase tracking-wider text-white">Ikuti Kami</h3>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/officialppkualatari"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-ink-400 transition-colors hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100089424300406&mibextid=wwXIfr&mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-ink-400 transition-colors hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} SIKEMAS — Pelabuhan Perikanan Kuala Tari. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck className="h-4 w-4 text-secondary-400" />
            <span>Dibuat untuk keselamatan nelayan Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
