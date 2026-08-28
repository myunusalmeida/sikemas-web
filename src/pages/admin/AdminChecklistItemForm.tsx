import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, CheckSquare } from 'lucide-react';
import { supabase, type ChecklistCategoryDb, type ChecklistItemDb } from '../../lib/supabase';
import { LoadingState } from '../../components/ui';

const iconPresets = [
  { name: 'Shirt', label: 'Jaket / Baju' },
  { name: 'FireExtinguisher', label: 'APAR' },
  { name: 'LifeBuoy', label: 'Pelampung' },
  { name: 'Flame', label: 'Api / Selimut' },
  { name: 'Flashlight', label: 'Senter' },
  { name: 'Compass', label: 'Kompas' },
  { name: 'Radio', label: 'Radio VHF' },
  { name: 'Smartphone', label: 'HP / Ponsel' },
  { name: 'Map', label: 'Peta' },
  { name: 'Fuel', label: 'Bahan Bakar' },
  { name: 'Ship', label: 'Kapal' },
  { name: 'Droplets', label: 'Air / Pompa' },
  { name: 'Lightbulb', label: 'Lampu' },
  { name: 'Heart', label: 'Kesehatan' },
  { name: 'Utensils', label: 'Makanan' },
  { name: 'Cross', label: 'P3K' },
  { name: 'Phone', label: 'Telepon' },
];

export default function AdminChecklistItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ChecklistCategoryDb[]>([]);
  const [categoryId, setCategoryId] = useState('perlengkapan');
  const [label, setLabel] = useState('');
  const [descText, setDescText] = useState('');
  const [icon, setIcon] = useState('LifeBuoy');
  const [iconColor, setIconColor] = useState('text-orange-500');
  const [urutan, setUrutan] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('checklist_categories')
      .select('*')
      .order('urutan', { ascending: true })
      .then(({ data }) => {
        if (data) setCategories(data as ChecklistCategoryDb[]);

        if (isEdit && id) {
          supabase
            .from('checklist_items')
            .select('*')
            .eq('id', id)
            .single()
            .then(({ data: itemData, error: itemErr }) => {
              if (itemErr || !itemData) {
                setError('Gagal memuat data item checklist.');
              } else {
                const item = itemData as ChecklistItemDb;
                setCategoryId(item.category_id);
                setLabel(item.label);
                setDescText(item.desc_text);
                setIcon(item.icon || 'LifeBuoy');
                setIconColor(item.icon_color || 'text-orange-500');
                setUrutan(item.urutan || 1);
                setIsActive(item.is_active);
              }
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!label.trim()) {
      setError('Silakan isi nama item checklist!');
      return;
    }

    setError(null);
    setSaving(true);

    const generatedId = isEdit && id ? id : label.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Math.floor(Math.random() * 1000);

    const payload = {
      id: generatedId,
      category_id: categoryId,
      label: label.trim(),
      desc_text: descText.trim(),
      icon,
      icon_color: iconColor,
      urutan: Number(urutan) || 1,
      is_active: isActive,
    };

    if (isEdit && id) {
      const { error: err } = await supabase.from('checklist_items').update(payload).eq('id', id);
      if (err) setError(err.message);
      else navigate('/admin/checklist');
    } else {
      const { error: err } = await supabase.from('checklist_items').insert([payload]);
      if (err) setError(err.message);
      else navigate('/admin/checklist');
    }

    setSaving(false);
  };

  if (loading) return <LoadingState label="Memuat data item checklist..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/admin/checklist"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Checklist
      </Link>

      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
          {isEdit ? 'Edit Item Checklist' : 'Tambah Item Checklist Baru'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Atur nama item, syarat kelengkapan, dan kategori checklist keselamatan melaut.
        </p>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Perhatian</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Kategori */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-900">
              Kategori Checklist <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Nama Item & Deskripsi */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-900">
              Nama Item / Perlengkapan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Selimut Pemadam Kebakaran"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-900">
              Deskripsi / Persyaratan Kelengkapan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={descText}
              onChange={(e) => setDescText(e.target.value)}
              placeholder="Contoh: 4 karung goni atau Wajib 100% sesuai jumlah ABK"
              className="w-full rounded-xl border border-ink-200 bg-white p-4 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Ikon Preset */}
          <div>
            <label className="mb-2 block text-sm font-bold text-ink-900">
              Simbol Ikon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconPresets.map((ic) => (
                <button
                  key={ic.name}
                  type="button"
                  onClick={() => setIcon(ic.name)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    icon === ic.name
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Urutan & Status */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Urutan Tampilan
              </label>
              <input
                type="number"
                min={1}
                value={urutan}
                onChange={(e) => setUrutan(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Status Tampilan
              </label>
              <label className="flex items-center gap-3 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-5 w-5 rounded border-ink-300 text-primary-600 focus:ring-primary-400"
                />
                <span className="text-sm font-semibold text-ink-800">
                  {isActive ? 'Aktif (Ditampilkan di Website)' : 'Nonaktif (Disembunyikan)'}
                </span>
              </label>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-6">
            <Link
              to="/admin/checklist"
              className="rounded-full bg-ink-100 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-200"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
