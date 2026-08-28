import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type HeroSlide } from '../../lib/supabase';
import { PageHeader, LoadingState, EmptyState } from '../../components/ui';

export default function AdminHero() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleToggleActive = async (slide: HeroSlide) => {
    const nextStatus = !slide.is_active;
    setSlides((prev) =>
      prev.map((item) => (item.id === slide.id ? { ...item, is_active: nextStatus } : item))
    );

    await supabase
      .from('hero_slides')
      .update({ is_active: nextStatus })
      .eq('id', slide.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar hero ini?')) return;
    setDeletingId(id);
    await supabase.from('hero_slides').delete().eq('id', id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const currentSlide = newSlides[index];
    const targetSlide = newSlides[targetIndex];

    // Swap urutan
    const tempUrutan = currentSlide.urutan;
    currentSlide.urutan = targetSlide.urutan;
    targetSlide.urutan = tempUrutan;

    setSlides(newSlides);

    await Promise.all([
      supabase.from('hero_slides').update({ urutan: currentSlide.urutan }).eq('id', currentSlide.id),
      supabase.from('hero_slides').update({ urutan: targetSlide.urutan }).eq('id', targetSlide.id),
    ]);

    fetchSlides();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Kelola Hero Banner CMS"
          subtitle="Atur gambar header beranda, teks overlay, dan urutan slide hero"
        />
        <Link
          to="/admin/hero/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 sm:self-start"
        >
          <Plus className="h-4 w-4" /> Tambah Banner Baru
        </Link>
      </div>

      {loading && <LoadingState label="Memuat banner hero..." />}

      {!loading && slides.length === 0 && (
        <EmptyState
          title="Belum ada banner hero"
          description="Tambahkan banner gambar pertama untuk ditampilkan di halaman beranda utama."
          actionLabel="Tambah Banner Baru"
          onAction={() => window.location.assign('/admin/hero/new')}
        />
      )}

      {!loading && slides.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-700">
              <thead className="bg-ink-50/70 text-xs font-bold uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-6 py-4">Gambar</th>
                  <th className="px-6 py-4">Judul / Subjudul</th>
                  <th className="px-6 py-4">Urutan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {slides.map((slide, idx) => (
                  <tr key={slide.id} className="transition-colors hover:bg-ink-50/40">
                    <td className="px-6 py-4">
                      <div className="relative h-16 w-28 overflow-hidden rounded-xl bg-ink-100 ring-1 ring-ink-200">
                        <img
                          src={slide.gambar_url}
                          alt={slide.alt_text || 'Hero banner'}
                          className="h-full w-full object-cover"
                          style={{ objectPosition: `center ${slide.position || 'center'}` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-bold text-ink-900 line-clamp-1">
                        {slide.judul || '(Tanpa Judul)'}
                      </p>
                      <p className="text-xs text-ink-500 line-clamp-1">
                        {slide.subjudul || slide.alt_text || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-xs font-bold text-ink-800">
                          {slide.urutan}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(idx, 'up')}
                            className="rounded p-0.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                            title="Naikkan urutan"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === slides.length - 1}
                            onClick={() => handleMoveOrder(idx, 'down')}
                            className="rounded p-0.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                            title="Turunkan urutan"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          slide.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {slide.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {slide.is_active ? 'Tampil' : 'Sembunyi'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/hero/${slide.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-primary-50 hover:text-primary-700 transition"
                          title="Edit Banner"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === slide.id}
                          onClick={() => handleDelete(slide.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                          title="Hapus Banner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
