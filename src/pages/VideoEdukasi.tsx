import { useEffect, useState } from 'react';
import {
  Video, Play, Youtube, ShieldCheck, LifeBuoy, Radio,
  Compass, Heart, AlertTriangle, Clock, ExternalLink, FileText, type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui';
import { supabase, type VideoDb } from '../lib/supabase';

type VideoItem = {
  id: string;
  judul: string;
  deskripsi: string;
  youtube_id: string;
  durasi: string;
  kategori: string;
};

const defaultVideos: VideoItem[] = [
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
    id: 'v7',
    judul: 'Kelengkapan Dokumen dan Prosedur Penerbitan Surat Persetujuan Berlayar (SPB)',
    deskripsi: 'Panduan singkat kelengkapan dokumen dan prosedur penerbitan Surat Persetujuan Berlayar (SPB) bagi nelayan.',
    youtube_id: 'EHfMUkVctbU',
    durasi: '2:59',
    kategori: 'Dokumen',
  },
];

const catIcon: Record<string, LucideIcon> = {
  Perlengkapan: LifeBuoy,
  Komunikasi: Radio,
  P3K: Heart,
  Navigasi: Compass,
  Kapal: ShieldCheck,
  Dokumen: FileText,
};

export default function VideoEdukasi() {
  const [videosList, setVideosList] = useState<VideoItem[]>(defaultVideos);
  const [active, setActive] = useState('Semua');
  const [selected, setSelected] = useState<VideoItem | null>(null);

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .eq('is_active', true)
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setVideosList(
            data.map((item: VideoDb) => ({
              id: item.id,
              judul: item.judul,
              deskripsi: item.deskripsi,
              youtube_id: item.youtube_id,
              durasi: item.durasi || '0:00',
              kategori: item.kategori,
            }))
          );
        }
      });
  }, []);

  const categories = ['Semua', ...Array.from(new Set(videosList.map((v) => v.kategori)))];
  const filtered = active === 'Semua' ? videosList : videosList.filter((v) => v.kategori === active);

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
              <p className="mt-1 text-sm text-ink-500">{selected.deskripsi}</p>
            </div>
          </div>
        ) : null}

        {/* Category filter */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = catIcon[cat] || Video;
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-ink-600 hover:bg-ink-100 hover:text-ink-900 shadow-sm border border-ink-100'
                }`}
              >
                {cat !== 'Semua' && <Icon className="h-3.5 w-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelected(video)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-ink-900">
                <img
                  src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                  alt={video.judul}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-1 h-6 w-6 fill-current" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 rounded-md bg-ink-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  {video.durasi}
                </span>
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-ink-900 backdrop-blur-sm shadow">
                  {video.kategori}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-ink-900 line-clamp-2 text-base group-hover:text-primary-600 transition-colors">
                  {video.judul}
                </h3>
                <p className="mt-2 text-xs text-ink-500 line-clamp-2 leading-relaxed">
                  {video.deskripsi}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-xs font-semibold text-primary-600">
                  <span>Tonton Video</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
