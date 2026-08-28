import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-900 to-primary-950 px-4 text-center text-white">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
        <Compass className="h-10 w-10 animate-float" />
      </div>
      <p className="text-6xl font-extrabold tracking-tight">404</p>
      <h1 className="mt-2 text-xl font-bold">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 max-w-md text-sm text-primary-200">
        Sepertinya Anda tersesat di lautan. Mari kembali ke perairan yang dikenal.
      </p>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-800 shadow-lg transition hover:scale-105">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
}
