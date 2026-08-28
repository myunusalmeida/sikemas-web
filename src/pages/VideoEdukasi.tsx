import { useState } from 'react';
import {
  Video, Play, Youtube, ShieldCheck, LifeBuoy, Radio, Cloud,
  Compass, Heart, AlertTriangle, Clock, ExternalLink, type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui';

type VideoItem = {
  id: string;
  judul: string;
  deskripsi: string;
  youtube_id: string;
  durasi: string;
  kategori: string;
};

const videos: VideoItem[] = [
  {
    id: 'v1',
    judul: 'Pentingnya Alat Keselamatan dan APAR di Kapal Perikanan | Edukasi Keselamatan PPN Kejawanan Cirebon',
    deskripsi: 'Video edukasi tentang pentingnya alat keselamatan dan APAR di kapal perikanan oleh PPN Kejawanan Cirebon.',
    youtube_id: 'EVvvOthZc28',
    durasi: '12:10',
    kategori: 'Perlengkapan',
  },
  {
    id: 'v2',
    judul: 'Sinyal Darurat di Laut: Cara Memanggil Bantuan',
    deskripsi: 'Pelajari sinyal darurat dan cara menggunakan radio komunikasi VHF channel 16.',
    youtube_id: '1oOi73pmHQg',
    durasi: '2:48',
    kategori: 'Komunikasi',
  },
  {
    id: 'v3',
    judul: 'Membaca Prakiraan Cuaca Maritim BMKG',
    deskripsi: 'Cara membaca dan memahami prakiraan cuaca maritim dari BMKG sebelum melaut.',
    youtube_id: 'vxMdKuCO7sw',
    durasi: '4:30',
    kategori: 'Cuaca',
  },
  {
    id: 'v4',
    judul: 'Pertolongan Pertama: RJP untuk Nelayan',
    deskripsi: 'Langkah-langkah resusitasi jantung paru untuk korban tenggelam.',
    youtube_id: 'cnJoPlHxFqM',
    durasi: '7:15',
    kategori: 'P3K',
  },
  {
    id: 'v5',
    judul: 'Navigasi Sederhana dengan Kompas & GPS',
    deskripsi: 'Dasar-dasar navigasi laut menggunakan kompas dan GPS untuk nelayan.',
    youtube_id: '3f3Vf_tNFXc',
    durasi: '11:42',
    kategori: 'Navigasi',
  },
  {
    id: 'v6',
    judul: 'Pemeriksaan Kapal Sebelum Berlayar',
    deskripsi: 'Checklist pemeriksaan mesin, lambung, dan alat keselamatan kapal.',
    youtube_id: 'V1tKhYnBW0g',
    durasi: '8:30',
    kategori: 'Kapal',
  },
  {
    id: 'v7',
    judul: 'Kelengkapan Dokumen dan Prosedur Penerbitan Surat Persetujuan Berlayar (SPB)',
    deskripsi: 'Panduan singkat kelengkapan dokumen dan prosedur penerbitan Surat Persetujuan Berlayar (SPB) bagi nelayan.',
    youtube_id: 'EHfMUkVctbU',
    durasi: '2:59',
    kategori: 'Kapal',
  },
];

const categories = ['Semua', 'Perlengkapan', 'Komunikasi', 'Cuaca', 'P3K', 'Navigasi', 'Kapal'];

const catIcon: Record<string, LucideIcon> = {
  Perlengkapan: LifeBuoy,
  Komunikasi: Radio,
  Cuaca: Cloud,
  P3K: Heart,
  Navigasi: Compass,
  Kapal: ShieldCheck,
};

export default function VideoEdukasi() {
  const [active, setActive] = useState('Semua');
  const [selected, setSelected] = useState<VideoItem | null>(null);

  const filtered = active === 'Semua' ? videos : videos.filter((v) => v.kategori === active);

  return (
    <div className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          title="Video Edukasi"
          subtitle="Pelajari keselamatan melaut lewat video praktis"
          icon={Video}
        />

        {/* Featured / Player */}
        {selected ? (
          <div className="mb-8 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lg">
            <div className="relative aspect-video w-full bg-ink-950">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${selected.youtube_id}`}
                title={selected.judul}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5">
              <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-700">
                {selected.kategori}
              </span>
              <h2 className="mt-2 text-xl font-extrabold text-ink-900">{selected.judul}</h2>
              <p className="mt-1 text-sm text-ink-600">{selected.deskripsi}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                ← Kembali ke daftar video
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 p-6 text-white shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Youtube className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold">Belajar Lewat Video</p>
              <p className="text-sm text-primary-100">Tonton panduan praktis keselamatan melaut dari pelatih & petugas berpengalaman.</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === cat
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => {
            const Icon = catIcon[v.kategori] ?? Video;
            return (
              <button
                key={v.id}
                onClick={() => setSelected(v)}
                className="group overflow-hidden rounded-2xl border border-ink-100 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-200/40"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-ink-100">
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`}
                    alt={v.judul}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-950/30 transition-colors group-hover:bg-ink-950/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 translate-x-0.5 text-primary-700" fill="currentColor" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-md bg-ink-950/80 px-2 py-0.5 text-xs font-semibold text-white">
                    {v.durasi}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{v.kategori}</span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink-900 group-hover:text-primary-700">
                    {v.judul}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-500">{v.deskripsi}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-amber-50 p-5 text-amber-800 ring-1 ring-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm">
            Video dimuat dari YouTube. Pastikan koneksi internet stabil. Untuk pelatihan tatap muka, hubungi BASARNAS atau Syahbandar terdekat.
          </p>
        </div>
      </div>
    </div>
  );
}
