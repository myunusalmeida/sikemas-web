import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Newspaper, Clock, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { supabase, type Berita } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui';

export default function AdminBerita() {
  const [items, setItems] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setItems(data ?? []);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus berita ini? Tindakan tidak dapat dibatalkan.')) return;
    setDeleting(id);
    const { error } = await supabase.from('berita').delete().eq('id', id);
    setDeleting(null);
    if (error) alert('Gagal menghapus: ' + error.message);
    else load();
  };

  const filtered = items.filter((i) => i.judul.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Kelola Berita</h1>
          <p className="mt-1 text-sm text-ink-500">{items.length} berita terdaftar</p>
        </div>
        <Link to="/admin/berita/new" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Tambah Berita
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berita..."
          className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {loading && <LoadingState label="Memuat berita..." />}
      {error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="Belum ada berita" description="Klik 'Tambah Berita' untuk membuat berita pertama." icon={Newspaper} />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <ul className="divide-y divide-ink-50">
            {filtered.map((b) => (
              <li key={b.id} className="flex items-center gap-4 p-4">
                <div className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ink-100 sm:block">
                  {b.gambar_url ? (
                    <img src={b.gambar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-300"><Newspaper className="h-6 w-6" /></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${b.status === 'publish' ? 'bg-secondary-100 text-secondary-700' : 'bg-ink-100 text-ink-600'}`}>
                      {b.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-400">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-bold text-ink-900">{b.judul}</h3>
                  <p className="truncate text-xs text-ink-500">{b.ringkasan ?? b.konten.slice(0, 80)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Link to={`/admin/berita/${b.id}/edit`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-primary-50 hover:text-primary-700" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deleting === b.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Hapus"
                  >
                    {deleting === b.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <span>Status "draft" tidak ditampilkan ke publik. Ubah ke "publish" untuk menampilkan berita di halaman Berita.</span>
      </div>
    </div>
  );
}
