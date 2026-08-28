import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { supabase, type NomorDarurat } from '../../lib/supabase';

const categories = [
  { value: 'basarnas', label: 'SAR & Penyelamat' },
  { value: 'syahbandar', label: 'Otoritas Pelabuhan' },
  { value: 'kepolisian', label: 'Keamanan Laut' },
  { value: 'bmkg', label: 'Cuaca & Iklim' },
  { value: 'ambulans', label: 'Medis & Gawat Darurat' },
  { value: 'pelabuhan', label: 'Pelabuhan Perikanan' },
  { value: 'lainnya', label: 'Lainnya' },
];

const icons = [
  { value: 'anchor', label: 'Anchor' },
  { value: 'ship', label: 'Ship' },
  { value: 'shield', label: 'Shield' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'heart', label: 'Heart' },
];

export default function AdminNomorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [nama, setNama] = useState('');
  const [telp, setTelp] = useState('');
  const [kategori, setKategori] = useState('lainnya');
  const [ikon, setIkon] = useState('anchor');
  const [urutan, setUrutan] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('nomor_darurat')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) {
          const n = data as NomorDarurat;
          setNama(n.nama_instansi);
          setTelp(n.nomor_telp);
          setKategori(n.kategori);
          setIkon(n.ikon ?? 'anchor');
          setUrutan(n.urutan);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nama.trim() || !telp.trim()) {
      setError('Nama instansi dan nomor telepon wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      nama_instansi: nama.trim(),
      nomor_telp: telp.trim(),
      kategori,
      ikon,
      urutan: Number(urutan) || 0,
    };
    const result = isEdit
      ? await supabase.from('nomor_darurat').update(payload).eq('id', id!)
      : await supabase.from('nomor_darurat').insert(payload);
    setSaving(false);
    if (result.error) setError(result.error.message);
    else navigate('/admin/nomor-darurat');
  };

  if (loading) return <div className="py-16 text-center text-sm text-ink-500">Memuat...</div>;

  return (
    <div>
      <Link to="/admin/nomor-darurat" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
          {isEdit ? 'Edit Kontak Darurat' : 'Tambah Kontak Darurat'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">{isEdit ? 'Perbarui informasi kontak' : 'Tambah nomor darurat baru'}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Nama Instansi <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            placeholder="Contoh: BASARNAS"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Nomor Telepon <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={telp}
            onChange={(e) => setTelp(e.target.value)}
            required
            placeholder="Contoh: 115 atau 0812-3456-7890"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">Ikon</label>
            <select
              value={ikon}
              onChange={(e) => setIkon(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {icons.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">Urutan Tampil</label>
          <input
            type="number"
            value={urutan}
            onChange={(e) => setUrutan(Number(e.target.value))}
            min={0}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          <p className="mt-1.5 text-xs text-ink-400">Nomor kecil tampil lebih dulu</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-700 disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : <><Save className="h-4 w-4" /> {isEdit ? 'Simpan Perubahan' : 'Tambah Kontak'}</>}
        </button>
      </form>
    </div>
  );
}
