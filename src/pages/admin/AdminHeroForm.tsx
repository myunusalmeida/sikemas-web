import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Check, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { supabase, type HeroSlide } from '../../lib/supabase';
import { compressAndValidateBannerImage, formatFileSize } from '../../utils/imageCompressor';
import { LoadingState } from '../../components/ui';

export default function AdminHeroForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [judul, setJudul] = useState('');
  const [subjudul, setSubjudul] = useState('');
  const [gambarUrl, setGambarUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [position, setPosition] = useState('center');
  const [urutan, setUrutan] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSizeInfo, setImageSizeInfo] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      supabase
        .from('hero_slides')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            setError('Gagal memuat data banner hero.');
          } else {
            const slide = data as HeroSlide;
            setJudul(slide.judul || '');
            setSubjudul(slide.subjudul || '');
            setGambarUrl(slide.gambar_url);
            setAltText(slide.alt_text || '');
            setPosition(slide.position || 'center');
            setUrutan(slide.urutan || 1);
            setIsActive(slide.is_active);
          }
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setCompressing(true);
    setImageSizeInfo(null);

    try {
      // Automatic client-side compression & size validation
      const result = await compressAndValidateBannerImage(file, 500 * 1024);
      setGambarUrl(result.dataUrl);
      setImageSizeInfo(
        `Gambar berhasil dikompresi: ${formatFileSize(file.size)} ➔ ${result.sizeFormatted} (${result.width}×${result.height}px)`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses gambar.');
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!gambarUrl) {
      setError('Silakan pilih atau unggah gambar banner!');
      return;
    }

    setError(null);
    setSaving(true);

    const payload = {
      judul: judul.trim() || null,
      subjudul: subjudul.trim() || null,
      gambar_url: gambarUrl,
      alt_text: altText.trim() || judul.trim() || 'Hero Banner',
      position,
      urutan: Number(urutan) || 1,
      is_active: isActive,
    };

    if (isEdit && id) {
      const { error: err } = await supabase
        .from('hero_slides')
        .update(payload)
        .eq('id', id);

      if (err) setError(err.message);
      else navigate('/admin/hero');
    } else {
      const { error: err } = await supabase.from('hero_slides').insert([payload]);

      if (err) setError(err.message);
      else navigate('/admin/hero');
    }

    setSaving(false);
  };

  if (loading) return <LoadingState label="Memuat data banner..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/admin/hero"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Banner
      </Link>

      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
          {isEdit ? 'Edit Banner Hero' : 'Tambah Banner Hero Baru'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Unggah gambar banner berkualitas tinggi dengan ukuran optimal (&lt; 500 KB) untuk tampilan beranda full-screen.
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
          {/* File Upload Section with Validation */}
          <div>
            <label className="mb-2 block text-sm font-bold text-ink-900">
              Gambar Banner <span className="text-red-500">*</span>
            </label>
            <p className="mb-3 text-xs text-ink-500">
              Sistem akan otomatis mengompresi gambar ke format WebP teroptimasi di bawah 500 KB.
            </p>

            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/50 p-6 text-center transition hover:border-primary-400">
              {gambarUrl ? (
                <div className="space-y-4">
                  <div className="relative mx-auto h-48 w-full max-w-xl overflow-hidden rounded-2xl bg-ink-900 shadow-md">
                    <img
                      src={gambarUrl}
                      alt="Pratinjau Banner"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `center ${position}` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-left text-white">
                      <p className="font-bold text-sm line-clamp-1">{judul || 'Judul Banner (Pratinjau)'}</p>
                      <p className="text-xs text-white/80 line-clamp-1">{subjudul || 'Subjudul Banner (Pratinjau)'}</p>
                    </div>
                  </div>

                  {imageSizeInfo && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <Sparkles className="h-3.5 w-3.5" /> {imageSizeInfo}
                    </div>
                  )}

                  <div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary-700 shadow ring-1 ring-ink-200 hover:bg-primary-50">
                      <Upload className="h-3.5 w-3.5" /> Ganti Gambar
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-6">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-bold text-ink-900">
                    Klik untuk memilih atau seret gambar ke sini
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    Format yang didukung: JPG, PNG, WebP (Maksimal 500 KB - 1 MB)
                  </p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {compressing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <p className="inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                    Mengompresi & Memvalidasi Ukuran Gambar...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alignment Position */}
          <div>
            <label className="mb-2 block text-sm font-bold text-ink-900">
              Posisi Fokus Gambar (Crop Focus)
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'top', label: 'Atas' },
                { id: 'center', label: 'Tengah' },
                { id: '60%', label: 'Bawah-Tengah (60%)' },
                { id: 'bottom', label: 'Bawah' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPosition(pos.id)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    position === pos.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form inputs */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Judul Overlay (Opsional)
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Misal: Selamat Datang di SIKEMAS"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Subjudul / Deskripsi (Opsional)
              </label>
              <input
                type="text"
                value={subjudul}
                onChange={(e) => setSubjudul(e.target.value)}
                placeholder="Misal: Sistem Informasi Keselamatan Maritim"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Urutan Slide
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
                  {isActive ? 'Aktif (Ditampilkan di Beranda)' : 'Nonaktif (Disembunyikan)'}
                </span>
              </label>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-6">
            <Link
              to="/admin/hero"
              className="rounded-full bg-ink-100 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-200"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving || compressing}
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
