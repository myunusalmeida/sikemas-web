import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper, Phone, Eye, Plus, ArrowRight, TrendingUp,
  Clock, ShieldCheck, Image as ImageIcon,
} from 'lucide-react';
import { supabase, type Berita, type NomorDarurat, type HeroSlide } from '../../lib/supabase';

type StatRow = { halaman: string; count: number };

const pageLabels: Record<string, string> = {
  beranda: 'Beranda',
  cuaca: 'Info Cuaca',
  checklist: 'Checklist',
  'pertolongan-pertama': 'Pertolongan Pertama',
  'nomor-darurat': 'Nomor Darurat',
  video: 'Video Edukasi',
  berita: 'Berita',
  tentang: 'Tentang',
};

export default function AdminDashboard() {
  const [beritaCount, setBeritaCount] = useState(0);
  const [beritaPublished, setBeritaPublished] = useState(0);
  const [nomorCount, setNomorCount] = useState(0);
  const [heroCount, setHeroCount] = useState(0);
  const [pageStats, setPageStats] = useState<StatRow[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentBerita, setRecentBerita] = useState<Berita[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('berita').select('*', { count: 'exact', head: false }).order('created_at', { ascending: false }).limit(5),
      supabase.from('berita').select('*', { count: 'exact', head: true }).eq('status', 'publish'),
      supabase.from('nomor_darurat').select('*', { count: 'exact', head: true }),
      supabase.from('hero_slides').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('page_views').select('halaman'),
    ]).then(([b, bp, n, h, pv]) => {
      setRecentBerita((b.data ?? []) as Berita[]);
      setBeritaCount(b.count ?? 0);
      setBeritaPublished(bp.count ?? 0);
      setNomorCount(n.count ?? 0);
      setHeroCount(h.count ?? 0);
      const rows = pv.data as { halaman: string }[] | null;
      if (rows) {
        const map = new Map<string, number>();
        rows.forEach((r) => map.set(r.halaman, (map.get(r.halaman) ?? 0) + 1));
        const arr = Array.from(map.entries())
          .map(([halaman, count]) => ({ halaman, count }))
          .sort((a, b) => b.count - a.count);
        setPageStats(arr);
        setTotalViews(rows.length);
      }
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Banner Hero', value: heroCount, sub: 'Banner aktif beranda', icon: ImageIcon, color: 'from-sky-500 to-blue-600', to: '/admin/hero' },
    { label: 'Total Berita', value: beritaCount, sub: `${beritaPublished} dipublikasikan`, icon: Newspaper, color: 'from-primary-500 to-primary-700', to: '/admin/berita' },
    { label: 'Nomor Darurat', value: nomorCount, sub: 'Kontak aktif', icon: Phone, color: 'from-accent-500 to-orange-600', to: '/admin/nomor-darurat' },
    { label: 'Total Kunjungan', value: totalViews, sub: 'Semua halaman', icon: Eye, color: 'from-secondary-500 to-green-600', to: '#' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">Ringkasan pengelolaan konten SIKEMAS</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className="group rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-1 group-hover:text-primary-600" />
              </div>
              <p className="mt-4 text-3xl font-extrabold text-ink-900">{loading ? '—' : c.value}</p>
              <p className="text-sm font-semibold text-ink-700">{c.label}</p>
              <p className="text-xs text-ink-500">{c.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent berita */}
        <div className="lg:col-span-2 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-900">Berita Terbaru</h2>
            <Link to="/admin/berita" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">
              Kelola <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="py-8 text-center text-sm text-ink-400">Memuat...</div>
          ) : recentBerita.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-400">Belum ada berita</div>
          ) : (
            <ul className="divide-y divide-ink-50">
              {recentBerita.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{b.judul}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${b.status === 'publish' ? 'bg-secondary-100 text-secondary-700' : 'bg-ink-100 text-ink-600'}`}>
                        {b.status}
                      </span>
                    </p>
                  </div>
                  <Link to={`/admin/berita/${b.id}/edit`} className="shrink-0 text-xs font-semibold text-primary-600 hover:text-primary-700">
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t border-ink-50 pt-4">
            <Link to="/admin/berita/new" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-primary-700">
              <Plus className="h-4 w-4" /> Tambah Berita
            </Link>
          </div>
        </div>

        {/* Page views */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h2 className="text-base font-bold text-ink-900">Kunjungan Halaman</h2>
          </div>
          {loading ? (
            <div className="py-8 text-center text-sm text-ink-400">Memuat...</div>
          ) : pageStats.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-400">Belum ada data</div>
          ) : (
            <ul className="space-y-3">
              {pageStats.map((s) => {
                const max = pageStats[0]?.count ?? 1;
                const pct = Math.round((s.count / max) * 100);
                return (
                  <li key={s.halaman}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-700">{pageLabels[s.halaman] ?? s.halaman}</span>
                      <span className="font-bold text-ink-900">{s.count}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Quick info */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-primary-50/60 p-5 ring-1 ring-primary-100">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
        <p className="text-sm text-ink-700">
          Selamat datang di panel admin SIKEMAS. Anda dapat mengelola berita, pengumuman, dan nomor darurat yang ditampilkan ke nelayan. Pastikan informasi yang dipublikasikan selalu akurat dan terkini.
        </p>
      </div>
    </div>
  );
}
