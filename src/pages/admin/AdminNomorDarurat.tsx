import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Phone, Pencil, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type NomorDarurat } from '../../lib/supabase';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui';

const categoryLabels: Record<string, string> = {
  basarnas: 'SAR & Penyelamat',
  syahbandar: 'Otoritas Pelabuhan',
  kepolisian: 'Keamanan Laut',
  bmkg: 'Cuaca & Iklim',
  ambulans: 'Medis & Gawat Darurat',
  pelabuhan: 'Pelabuhan Perikanan',
  lainnya: 'Lainnya',
};

export default function AdminNomorDarurat() {
  const [items, setItems] = useState<NomorDarurat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supabase
      .from('nomor_darurat')
      .select('*')
      .order('urutan', { ascending: true })
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
    if (!confirm('Hapus kontak ini?')) return;
    setDeleting(id);
    const { error } = await supabase.from('nomor_darurat').delete().eq('id', id);
    setDeleting(null);
    if (error) alert('Gagal menghapus: ' + error.message);
    else load();
  };

  const move = async (item: NomorDarurat, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from('nomor_darurat').update({ urutan: swap.urutan }).eq('id', item.id),
      supabase.from('nomor_darurat').update({ urutan: item.urutan }).eq('id', swap.id),
    ]);
    load();
  };

  const filtered = items.filter((i) => i.nama_instansi.toLowerCase().includes(search.toLowerCase()) || i.nomor_telp.includes(search));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Kelola Nomor Darurat</h1>
          <p className="mt-1 text-sm text-ink-500">{items.length} kontak terdaftar</p>
        </div>
        <Link to="/admin/nomor-darurat/new" className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Tambah Kontak
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kontak..."
          className="w-full rounded-full border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {loading && <LoadingState label="Memuat kontak..." />}
      {error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="Belum ada kontak" description="Klik 'Tambah Kontak' untuk menambah nomor darurat." icon={Phone} />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <ul className="divide-y divide-ink-50">
            {filtered.map((item, idx) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(item, -1)} disabled={idx === 0} className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-400 hover:bg-ink-100 disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => move(item, 1)} disabled={idx === items.length - 1} className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-400 hover:bg-ink-100 disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-ink-900">{item.nama_instansi}</h3>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-600">
                      {categoryLabels[item.kategori] ?? item.kategori}
                    </span>
                  </div>
                  <p className="mt-0.5 text-lg font-extrabold text-primary-700">{item.nomor_telp}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Link to={`/admin/nomor-darurat/${item.id}/edit`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-primary-50 hover:text-primary-700" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Hapus"
                  >
                    {deleting === item.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
