import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Clock, Search, ArrowRight } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components/ui';
import { supabase, type Berita as BeritaType } from '../lib/supabase';

export default function Berita() {
  const [items, setItems] = useState<BeritaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('berita')
      .select('*')
      .eq('status', 'publish')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(
    (i) =>
      i.judul.toLowerCase().includes(search.toLowerCase()) ||
      (i.ringkasan ?? '').toLowerCase().includes(search.toLowerCase())
  );
  const [featured, ...rest] = filtered;

  return (
    <div className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-10">
        <PageHeader
          title="Berita & Pengumuman"
          subtitle="Info terbaru dari Pelabuhan Perikanan Kuala Tari"
          icon={Newspaper}
        />

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berita..."
            className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-ink-900 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {loading && <LoadingState label="Memuat berita..." />}
        {error && <ErrorState message={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="Belum ada berita" description="Coba kata kunci lain atau kembali nanti." icon={Newspaper} />
        )}

        {!loading && !error && featured && (
          <>
            {/* Featured */}
            <Link
              to={`/berita/${featured.id}`}
              className="group mb-8 grid overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-ink-200/40 lg:grid-cols-2"
            >
              <div className="relative h-64 overflow-hidden bg-ink-100 lg:h-auto">
                {featured.gambar_url ? (
                  <img src={featured.gambar_url} alt={featured.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300"><Newspaper className="h-12 w-12" /></div>
                )}
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-700">
                  Berita Utama
                </span>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight text-ink-900 group-hover:text-primary-700 sm:text-3xl">
                  {featured.judul}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-600">{featured.ringkasan ?? featured.konten}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(featured.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                  Baca selengkapnya <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((b) => (
                  <Link
                    key={b.id}
                    to={`/berita/${b.id}`}
                    className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-200/40"
                  >
                    <div className="relative h-44 overflow-hidden bg-ink-100">
                      {b.gambar_url ? (
                        <img src={b.gambar_url} alt={b.judul} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ink-300"><Newspaper className="h-10 w-10" /></div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-ink-400">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-ink-900 group-hover:text-primary-700">{b.judul}</h3>
                      {b.ringkasan && <p className="mt-2 line-clamp-2 text-sm text-ink-500">{b.ringkasan}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
