import { Link } from 'react-router-dom';
import {
  Info, ShieldCheck, Target, Eye, Users, Waves, Anchor,
  Ship, Heart, MapPin, Phone, Mail, Award, LifeBuoy, Compass,
} from 'lucide-react';
import { PageHeader } from '../components/ui';

const visi = 'Menjadi sistem informasi keselamatan melaut terdepan di Indonesia yang menurunkan angka kecelakaan dan korban di laut, serta memberdayakan nelayan dengan informasi yang akurat dan tepat waktu.';

const misi = [
  'Menyediakan informasi cuaca maritim yang akurat dan mudah diakses oleh nelayan.',
  'Meningkatkan kesadaran akan pentingnya keselamatan kerja di laut melalui edukasi.',
  'Mempercepat respons kedaruratan dengan menyediakan kontak darurat terpadu.',
  'Membangun budaya keselamatan melaut berbasis data dan kolaborasi.',
];

const fitur = [
  { icon: Waves, label: 'Info Cuaca Maritim', desc: 'Prakiraan gelombang, angin, dan peringatan dini dari BMKG.' },
  { icon: ShieldCheck, label: 'Checklist Keselamatan', desc: 'Daftar periksa perlengkapan dan kesiapan sebelum berlayar.' },
  { icon: Heart, label: 'Panduan P3K', desc: 'Langkah pertolongan pertama untuk keadaan darurat di laut.' },
  { icon: Phone, label: 'Kontak Darurat', desc: 'Nomor penting SAR, polisi, medis, dan otoritas pelabuhan.' },
  { icon: LifeBuoy, label: 'Video Edukasi', desc: 'Panduan visual praktis keselamatan melaut.' },
  { icon: Compass, label: 'Berita & Info', desc: 'Pengumuman, sosialisasi, dan info pelabuhan terkini.' },
];

const stats = [
  { value: '6', label: 'Modul Informasi', icon: Award },
  { value: '24/7', label: 'Akses Informasi', icon: ShieldCheck },
  { value: '4', label: 'Hari Prakiraan Cuaca', icon: Waves },
  { value: '100%', label: 'Gratis untuk Nelayan', icon: Heart },
];

export default function Tentang() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-950 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="container-app relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <Info className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-balance">
              Tentang SIKEMAS
            </h1>
            <p className="mt-4 text-lg text-primary-100">
              Sistem Informasi Keselamatan Melaut — Pelabuhan Perikanan Kuala Tari
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
                <Anchor className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">Apa itu SIKEMAS?</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-600">
                  SIKEMAS adalah platform informasi terpadu yang dibangun untuk membantu nelayan di Pelabuhan Perikanan Kuala Tari dan sekitarnya. Aplikasi ini menyediakan informasi cuaca maritim, panduan keselamatan, kontak darurat, video edukasi, dan berita pelabuhan dalam satu tempat yang mudah diakses.
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-600">
                  Dengan SIKEMAS, kami berharap setiap nelayan dapat melaut dengan lebih aman, lebih siap menghadapi kondisi darurat, dan lebih cepat mendapatkan bantuan ketika dibutuhkan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-ink-50/60 py-16">
        <div className="container-app">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-ink-900">Visi</h3>
              </div>
              <p className="mt-4 text-base leading-relaxed text-ink-600">{visi}</p>
            </div>

            <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-ink-900">Misi</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {misi.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-600">
                    <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-xs font-bold text-secondary-700">{i + 1}</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container-app">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-ink-900">{s.value}</p>
                  <p className="text-xs font-medium text-ink-500">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="bg-ink-50/60 py-16">
        <div className="container-app">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Fitur Utama</h2>
            <p className="mt-2 text-ink-500">Enam modul informasi untuk mendukung keselamatan melaut.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fitur.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md">
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink-900">{f.label}</h3>
                  <p className="mt-1 text-sm text-ink-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Untuk siapa */}
      <section className="py-16">
        <div className="container-app">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Untuk Siapa SIKEMAS?</h2>
              <p className="mt-3 text-ink-600">
                SIKEMAS dirancang untuk seluruh pelaku aktivitas kelautan di Pelabuhan Perikanan Kuala Tari dan sekitarnya.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: Ship, text: 'Nelayan & awak kapal yang melaut setiap hari' },
                  { icon: Users, text: 'Keluarga nelayan untuk memantau info & keselamatan' },
                  { icon: Anchor, text: 'Petugas pelabuhan & Syahbandar' },
                  { icon: Heart, text: 'Masyarakat pesisir & komunitas nelayan' },
                ].map((x, i) => {
                  const Icon = x.icon;
                  return (
                    <li key={i} className="flex items-center gap-3 rounded-xl bg-ink-50/60 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-ink-700">{x.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary-200 to-secondary-200 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-700 to-primary-950 p-8 text-white shadow-xl">
                <Ship className="h-12 w-12 text-secondary-300" />
                <h3 className="mt-4 text-2xl font-extrabold">"Pulang Selamat, Tujuan Kami"</h3>
                <p className="mt-3 text-primary-100">
                  Setiap perjalanan melaut membawa risiko. Dengan informasi yang tepat dan kesiapan yang baik, kita dapat menurunkan risiko kecelakaan dan memastikan setiap nelayan pulang ke keluarganya dengan selamat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-ink-50/60 py-16">
        <div className="container-app">
          <div className="mx-auto max-w-3xl rounded-3xl border border-ink-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg">
                <MapPin className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-ink-900">Hubungi Kami</h2>
              <p className="mt-2 text-sm text-ink-500">Untuk pertanyaan, saran, atau kerja sama, hubungi kami.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:[&>div:last-child]:col-start-2">
              <div className="rounded-2xl bg-ink-50/60 p-5 text-center">
                <MapPin className="mx-auto h-6 w-6 text-primary-600" />
                <p className="mt-2 text-sm font-bold text-ink-900">Alamat</p>
                <p className="mt-0.5 text-xs text-ink-500">PP Kuala Tari, Pidie</p>
              </div>
              <div className="rounded-2xl bg-ink-50/60 p-5 text-center">
                <Phone className="mx-auto h-6 w-6 text-primary-600" />
                <p className="mt-2 text-sm font-bold text-ink-900">Instagram</p>
                <p className="mt-0.5 text-xs text-ink-500">officialppkualatari</p>
               </div>
              <div className="rounded-2xl bg-ink-50/60 p-5 text-center">
                <Phone className="mx-auto h-6 w-6 text-primary-600" />
                <p className="mt-2 text-sm font-bold text-ink-900">Facebook</p>
                <p className="mt-0.5 text-xs text-ink-500">Pelabuhan Perikanan Kuala Tari</p>
              </div>
              <div className="rounded-2xl bg-ink-50/60 p-5 text-center">
                <Mail className="mx-auto h-6 w-6 text-primary-600" />
                <p className="mt-2 text-sm font-bold text-ink-900">Email</p>
                <p className="mt-0.5 text-xs text-ink-500">pp.kualatari2022@gmail.com</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link to="/nomor-darurat" className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-accent-600">
                <Phone className="h-4 w-4" /> Lihat Nomor Darurat
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
