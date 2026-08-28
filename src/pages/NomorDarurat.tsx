import { useEffect, useState } from 'react';
import {
  Phone, MapPin,
  Search, AlertTriangle, Info,
} from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '../components/ui';
import { supabase, type NomorDarurat as NomorType } from '../lib/supabase';

const logoMap: Record<string, string> = {
  basarnas: '/Logo_Basarnas.png',
  syahbandar: '/Logo_Kementerian_Kelautan_dan_Perikanan.jpg',
  kepolisian: '/images_(1).jpg',
  bmkg: '/images.png',
  ambulans: '/png-clipart-american-red-cross-logo-ambulance-miscellaneous-ambulance-thumbnail.png',
  pelabuhan: '/logo-kk.webp',
  lainnya: '/logo-kk.webp',
};

const fallbackLogo = '/logo-kk.webp';

const categoryMap: Record<string, { label: string; color: string }> = {
  basarnas: { label: 'SAR & Penyelamat', color: 'from-red-500 to-rose-600' },
  syahbandar: { label: 'Otoritas Pengawasan', color: 'from-sky-500 to-blue-600' },
  kepolisian: { label: 'Keamanan Laut', color: 'from-indigo-500 to-blue-700' },
  bmkg: { label: 'Cuaca & Iklim', color: 'from-cyan-500 to-teal-600' },
  ambulans: { label: 'Medis & Gawat Darurat', color: 'from-rose-500 to-red-600' },
  pelabuhan: { label: 'Pelabuhan Perikanan', color: 'from-emerald-500 to-green-600' },
  lainnya: { label: 'Lainnya', color: 'from-slate-500 to-ink-700' },
};

export default function NomorDarurat() {
  const [items, setItems] = useState<NomorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('nomor_darurat')
      .select('*')
      .order('urutan', { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(
    (i) =>
      i.nama_instansi.toLowerCase().includes(search.toLowerCase()) ||
      i.nomor_telp.includes(search) ||
      (categoryMap[i.kategori]?.label ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-8">
        {/* ── Hero Section ── */}
        <section className="relative mb-8 flex overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: '410px', background: 'linear-gradient(135deg, #102470 0%, #1a3a8f 50%, #1e4faa 100%)' }}>
          {/* Subtle dot texture overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Hero image with left-side readability overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero/WhatsApp_Image_2026-08-24_at_10.09.13.jpeg"
              alt="Kru kapal memegang radio HT dengan kapal SAR di kejauhan"
              className="h-full w-full object-cover object-center"
              style={{ minHeight: '410px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/18 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent" />
          </div>

          {/* Mobile: overlay for readability */}
          <div className="absolute inset-0 z-[2] sm:hidden">
            <div className="absolute inset-0 bg-white/25" />
          </div>

          {/* Left: content */}
          <div className="relative z-10 flex w-full flex-col justify-center px-10 py-10 sm:w-[52%] sm:px-14">
            <div className="hidden">
              <Phone className="h-3.5 w-3.5 text-blue-300" />
              Panduan Darurat
            </div>
            <h1 className="mb-4 text-3xl font-black uppercase leading-[1.1] tracking-tight text-[#102470] drop-shadow-[0_1px_3px_rgba(255,255,255,1)] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:text-4xl lg:text-5xl">
              Nomor<br />Darurat
            </h1>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#102470] drop-shadow-[0_1px_3px_rgba(255,255,255,1)] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:text-base">
              Kontak penting kedaruratan di laut — simpan & hubungi saat dibutuhkan.
            </p>
            <div className="flex w-fit max-w-[17rem] items-start gap-2.5 rounded-2xl bg-slate-200 px-3.5 py-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-bold text-gray-900">Gunakan dengan Bijak</p>
                <p className="max-w-[15rem] text-xs leading-relaxed text-gray-500">
                  Hubungi nomor darurat hanya pada kondisi benar-benar darurat.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </section>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari instansi atau nomor..."
            className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-ink-900 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {loading && <LoadingState label="Memuat kontak darurat..." />}
        {error && <ErrorState message={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="Tidak ada kontak ditemukan" description="Coba kata kunci lain." icon={Search} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const cat = categoryMap[item.kategori] ?? categoryMap.lainnya;
              const telHref = `tel:${item.nomor_telp.replace(/[^0-9+]/g, '')}`;
              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-200/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border border-ink-100 shadow-md overflow-hidden">
                      <img
                        src={logoMap[item.kategori] ?? fallbackLogo}
                        alt={`Logo ${item.nama_instansi}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-600">
                        {cat.label}
                      </span>
                      <h3 className="mt-1.5 text-base font-bold leading-tight text-ink-900">{item.nama_instansi}</h3>
                      <p className="mt-1 text-2xl font-extrabold tracking-tight text-primary-700">{item.nomor_telp}</p>
                    </div>
                  </div>
                  <a
                    href={telHref}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    Hubungi Sekarang
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Emergency tips */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-sm font-bold">Saat Menelepon 115/110</h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
              <li>· Sebutkan identitas & lokasi Anda (koordinat GPS jika ada)</li>
              <li>· Jelaskan jenis & skala keadaan darurat</li>
              <li>· Jumlah korban & kondisi kapal</li>
              <li>· Jangan menutup telepon sebelum operator selesai</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-5">
            <div className="flex items-center gap-2 text-primary-700">
              <MapPin className="h-5 w-5" />
              <h3 className="text-sm font-bold">Sinyal Darurat</h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
              <li>· Sinyal asap: 3 tiang asap berjarak sama</li>
              <li>· Sinyal api: 3 api unggun segitiga</li>
              <li>· Bendera: bola atau kotak di tiang</li>
              <li>· Radio VHF: Channel 16 (distress call)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
