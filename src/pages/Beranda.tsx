import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cloud, CheckSquare, Heart, Phone, Video, Newspaper,
  ArrowRight, Waves, Ship, Clock,
} from 'lucide-react';
import { supabase, type Berita as BeritaType, type HeroSlide } from '../lib/supabase';

const defaultHeroSlides = [
  { src: '/images/WhatsApp_Image_2026-07-22_at_15.16.04.jpeg', alt: 'Kapal nelayan di laut', position: '60%', judul: '', subjudul: '' },
  { src: '/images/WhatsApp_Image_2026-08-23_at_13.09.02_(2).jpeg', alt: 'Kapal nelayan warna tosca di laut', position: 'center', judul: '', subjudul: '' },
  { src: '/images/WhatsApp_Image_2026-08-23_at_13.09.02_(1).jpeg', alt: 'Kapal nelayan warna putih-biru di laut', position: 'center', judul: '', subjudul: '' },
];

const features = [
  { to: '/cuaca', label: 'Info Cuaca', desc: 'Prakiraan cuaca & gelombang', icon: Cloud, color: 'from-sky-500 to-blue-600' },
  { to: '/checklist', label: 'Checklist', desc: 'Daftar peralatan keselamatan', icon: CheckSquare, color: 'from-emerald-500 to-green-600' },
  { to: '/pertolongan-pertama', label: 'Pertolongan Pertama', desc: 'Panduan P3K darurat', icon: Heart, color: 'from-rose-500 to-red-600' },
  { to: '/nomor-darurat', label: 'Nomor Darurat', desc: 'Kontak penting kedaruratan', icon: Phone, color: 'from-amber-500 to-orange-600' },
  { to: '/video', label: 'Video Edukasi', desc: 'Video keselamatan melaut', icon: Video, color: 'from-violet-500 to-purple-600' },
  { to: '/berita', label: 'Berita', desc: 'Info & pengumuman terbaru', icon: Newspaper, color: 'from-cyan-500 to-teal-600' },
];

export default function Beranda() {
  const [berita, setBerita] = useState<BeritaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);

  useEffect(() => {
    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('urutan', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setHeroSlides(
            data.map((item: HeroSlide) => ({
              src: item.gambar_url,
              alt: item.alt_text || 'Hero Slide',
              position: item.position || 'center',
              judul: item.judul || '',
              subjudul: item.subjudul || '',
            }))
          );
        }
      });
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    supabase
      .from('berita')
      .select('*')
      .eq('status', 'publish')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setBerita(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Full Height */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16 lg:pt-0">
        {/* Background image */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src + index}
              src={slide.src}
              alt={slide.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              aria-hidden={index !== activeHeroSlide}
              style={{ objectPosition: `center ${slide.position}`, filter: 'brightness(1.08) contrast(1.05)' }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/65 via-primary-900/40 to-primary-800/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
        </div>

        {/* Wave overlay at bottom */}
        <svg className="pointer-events-none absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C320,80 720,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>

        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" role="tablist" aria-label="Slide hero">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.src + index}
              type="button"
              onClick={() => setActiveHeroSlide(index)}
              role="tab"
              aria-selected={index === activeHeroSlide}
              aria-label={`Tampilkan slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeHeroSlide ? 'w-7 bg-white shadow-md' : 'w-2.5 bg-white/55 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        <div className="container-app relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex -translate-x-3 translate-y-2 items-center gap-2 px-4 py-1.5 text-md font-semibold text-white">
              Selamat Datang di
            </div>
            <h1 className="mt-5 font-header text-5xl font-black leading-none tracking-tight text-white sm:text-6xl lg:text-7xl text-balance drop-shadow-lg">
              {heroSlides[activeHeroSlide]?.judul || (
                <>
                  SIKEMAS <span className="block mt-2 font-header text-lg font-semibold tracking-widest uppercase text-white sm:text-xl">Sistem Informasi Keselamatan Melaut</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl font-header text-base leading-relaxed text-white/85 sm:text-lg drop-shadow">
              {heroSlides[activeHeroSlide]?.subjudul ||
                'SIKEMAS menyediakan informasi cuaca, panduan keselamatan, kontak darurat, dan edukasi untuk nelayan. Pulang selamat adalah tujuan kami.'}
            </p>
          </div>
        </div>

        {/* Quote / tagline */}
        <div className="pointer-events-none absolute bottom-20 right-6 z-10 max-w-xs text-right sm:right-8 lg:right-12">
          <p className="font-header text-sm font-bold italic leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-base lg:text-lg">
            &quot;Utamakan Keselamatan,
            <br />
            Keluarga Menunggu di Rumah&quot;
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-primary-600">Layanan SIKEMAS</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Semua yang Anda butuhkan untuk melaut aman
            </h2>
            <p className="mt-3 text-ink-500">
              Akses informasi penting keselamatan melaut dalam satu platform terpadu.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.to}
                  to={f.to}
                  className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-200/40"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900">{f.label}</h3>
                  <p className="mt-1 text-sm text-ink-500">{f.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Buka <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Berita terbaru */}
      <section className="bg-ink-50/60 py-16 sm:py-20">
        <div className="container-app">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-primary-600">Info Terbaru</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Berita & Pengumuman
              </h2>
            </div>
            <Link
              to="/berita"
              className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:inline-flex"
            >
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {loading ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-white" />
              ))
            ) : berita.length === 0 ? (
              <div className="col-span-3 rounded-2xl border border-dashed border-ink-200 bg-white py-12 text-center text-ink-500">
                Belum ada berita
              </div>
            ) : (
              berita.map((b) => (
                <Link
                  key={b.id}
                  to={`/berita/${b.id}`}
                  className="group overflow-hidden rounded-2xl border border-ink-100 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-200/40"
                >
                  <div className="relative h-44 overflow-hidden bg-ink-100">
                    {b.gambar_url ? (
                      <img
                        src={b.gambar_url}
                        alt={b.judul}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-ink-300">
                        <Newspaper className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-ink-400">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-ink-900 group-hover:text-primary-700">
                      {b.judul}
                    </h3>
                    {b.ringkasan && (
                      <p className="mt-2 line-clamp-2 text-sm text-ink-500">{b.ringkasan}</p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/berita"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600"
            >
              Lihat semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 px-6 py-12 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full bg-secondary-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-primary-400/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
              <div className="max-w-xl">
                <Ship className="mx-auto h-10 w-10 text-secondary-300 lg:mx-0" />
                <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
                  Siap melaut dengan aman?
                </h2>
                <p className="mt-2 text-primary-100">
                  Pastikan kapal dan perlengkapan Anda siap sebelum berlayar. Gunakan checklist keselamatan SIKEMAS.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  to="/checklist"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-800 shadow-lg transition hover:scale-105"
                >
                  <CheckSquare className="h-4 w-4" />
                  Checklist Keselamatan
                </Link>
                <Link
                  to="/tentang"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
                >
                  Pelajari SIKEMAS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
