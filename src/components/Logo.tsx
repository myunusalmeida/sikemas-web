import { Link } from 'react-router-dom';
import { Anchor, Waves } from 'lucide-react';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
          <Anchor className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`text-lg font-extrabold tracking-tight font-header ${light ? 'text-white' : 'text-ink-900'}`}>
          SIKEMAS
        </span>
        <span className={`text-[8px] font-medium uppercase tracking-wider ${light ? 'text-primary-200' : 'text-ink-500'}`}>
          Sistem Informasi Keselamatan Melaut
        </span>
      </div>
    </Link>
  );
}
