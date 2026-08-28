import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Eye } from 'lucide-react';
import { supabase, type Berita } from '../../lib/supabase';

export default function AdminBeritaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [judul, setJudul] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [konten, setKonten] = useState('');
  const [gambarUrl, setGambarUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'publish'>('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('berita')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) {
          const b = data as Berita;
          setJudul(b.judul);
          setRingkasan(b.ringkasan ?? '');
          setKonten(b.konten);
          setGambarUrl(b.gambar_url ?? '');
          setStatus(b.status);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!judul.trim() || !konten.trim()) {
      setError('Judul dan konten wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      judul: judul.trim(),
      ringkasan: ringkasan.trim() || null,
      konten: konten.trim(),
      gambar_url: gambarUrl.trim() || null,
      status,
      updated_at: new Date().toISOString(),
    };
    let result;
    if (isEdit) {
      result = await supabase.from('berita').update(payload).eq('id', id!);
    } else {
      result = await supabase.from('berita').insert(payload);
    }
    setSaving(false);
    if (result.error) setError(result.error.message);
    else navigate('/admin/berita');
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-ink-500">Memuat...</div>;
  }

  return (
    <div>
      <Link to="/admin/berita" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          {isEdit ? 'Edit Berita' : 'Tambah Berita'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">{isEdit ? 'Perbarui konten berita' : 'Buat berita atau pengumuman baru'}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Judul <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              placeholder="Judul berita"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Ringkasan</label>
            <textarea
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat berita (opsional)"
              className="w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Konten <span className="text-red-500">*</span></label>
            <textarea
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              required
              rows={12}
              placeholder="Tulis konten berita di sini..."
              className="w-full resize-y rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            <p className="mt-1.5 text-xs text-ink-400">{konten.length} karakter</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Status Publikasi</label>
            <div className="grid grid-cols-2 gap-2">
              {(['draft', 'publish'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                    status === s
                      ? s === 'publish'
                        ? 'border-secondary-300 bg-secondary-50 text-secondary-700'
                        : 'border-ink-300 bg-ink-50 text-ink-700'
                      : 'border-ink-200 bg-white text-ink-500 hover:bg-ink-50'
                  }`}
                >
                  {s === 'publish' ? 'Publish' : 'Draft'}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-400">
              {status === 'publish' ? 'Berita akan tampil di halaman publik.' : 'Draft tidak tampil ke publik.'}
            </p>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">URL Gambar</label>
            <input
              type="url"
              value={gambarUrl}
              onChange={(e) => setGambarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            {gambarUrl && (
              <div className="mt-3 overflow-hidden rounded-lg border border-ink-100">
                <img src={gambarUrl} alt="Preview" className="h-32 w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : <><Save className="h-4 w-4" /> {isEdit ? 'Simpan Perubahan' : 'Publikasikan'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
