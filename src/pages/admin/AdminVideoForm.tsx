import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, AlertCircle, Youtube, Play, Sparkles } from 'lucide-react';
import { supabase, type VideoDb } from '../../lib/supabase';
import { LoadingState } from '../../components/ui';

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.slice(1);
    }
    if (url.searchParams.has('v')) {
      return url.searchParams.get('v') || '';
    }
    const pathParts = url.pathname.split('/');
    if (pathParts.includes('embed')) {
      return pathParts[pathParts.indexOf('embed') + 1] || '';
    }
  } catch {
    /* ignore */
  }
  return trimmed;
}

export default function AdminVideoForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [durasi, setDurasi] = useState('5:00');
  const [kategori, setKategori] = useState('Perlengkapan');
  const [customKategori, setCustomKategori] = useState('');
  const [urutan, setUrutan] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = ['Perlengkapan', 'Komunikasi', 'P3K', 'Navigasi', 'Kapal', 'Dokumen', '+ Kategori Baru'];

  useEffect(() => {
    if (isEdit && id) {
      supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            setError('Gagal memuat data video.');
          } else {
            const video = data as VideoDb;
            setJudul(video.judul);
            setDeskripsi(video.deskripsi);
            setYoutubeInput(video.youtube_id);
            setYoutubeId(video.youtube_id);
            setDurasi(video.durasi || '0:00');
            if (categoryOptions.includes(video.kategori)) {
              setKategori(video.kategori);
            } else {
              setKategori('+ Kategori Baru');
              setCustomKategori(video.kategori);
            }
            setUrutan(video.urutan || 1);
            setIsActive(video.is_active);
          }
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleYoutubeInputChange = (val: string) => {
    setYoutubeInput(val);
    const parsedId = extractYoutubeId(val);
    setYoutubeId(parsedId);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalYoutubeId = extractYoutubeId(youtubeInput);

    if (!finalYoutubeId) {
      setError('Silakan masukkan Link atau ID Youtube yang valid!');
      return;
    }

    const finalKategori = kategori === '+ Kategori Baru' ? customKategori.trim() : kategori;
    if (!finalKategori) {
      setError('Silakan pilih atau isi nama kategori video!');
      return;
    }

    setError(null);
    setSaving(true);

    const payload = {
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      youtube_id: finalYoutubeId,
      durasi: durasi.trim() || '0:00',
      kategori: finalKategori,
      urutan: Number(urutan) || 1,
      is_active: isActive,
    };

    if (isEdit && id) {
      const { error: err } = await supabase.from('videos').update(payload).eq('id', id);
      if (err) setError(err.message);
      else navigate('/admin/video');
    } else {
      const { error: err } = await supabase.from('videos').insert([payload]);
      if (err) setError(err.message);
      else navigate('/admin/video');
    }

    setSaving(false);
  };

  if (loading) return <LoadingState label="Memuat data video..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/admin/video"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Video
      </Link>

      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
          {isEdit ? 'Edit Video Edukasi' : 'Tambah Video Edukasi Baru'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Kelola video edukasi keselamatan laut untuk nelayan dengan mudah via link YouTube.
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
          {/* YouTube Link & Live Preview */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-900">
              Link atau ID YouTube <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Youtube className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
              <input
                type="text"
                required
                value={youtubeInput}
                onChange={(e) => handleYoutubeInputChange(e.target.value)}
                placeholder="Contoh: https://www.youtube.com/watch?v=EHfMUkVctbU atau EHfMUkVctbU"
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {/* Live YouTube Thumbnail Preview */}
            {youtubeId && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 sm:flex-row sm:items-center">
                <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-xl bg-ink-900 ring-1 ring-ink-200">
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt="Pratinjau YouTube"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-7 w-7 fill-white text-white drop-shadow" />
                  </div>
                </div>
                <div className="text-xs text-ink-600 space-y-1">
                  <p className="font-bold text-ink-900 text-sm">Pratinjau Video YouTube</p>
                  <p>YouTube ID Terdeteksi: <code className="rounded bg-ink-200 px-1.5 py-0.5 font-mono text-ink-900">{youtubeId}</code></p>
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:underline"
                  >
                    Buka Video di YouTube ↗
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Judul & Deskripsi */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-900">
              Judul Video <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Misal: Kelengkapan Dokumen SPB bagi Nelayan"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink-900">
              Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Penjelasan singkat isi video edukasi..."
              className="w-full rounded-xl border border-ink-200 bg-white p-4 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Kategori & Durasi */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Kategori Video <span className="text-red-500">*</span>
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {kategori === '+ Kategori Baru' && (
                <input
                  type="text"
                  required
                  value={customKategori}
                  onChange={(e) => setCustomKategori(e.target.value)}
                  placeholder="Ketik nama kategori baru (misal: Dokumen)"
                  className="mt-3 w-full rounded-xl border border-primary-300 bg-primary-50/50 px-4 py-2 text-sm font-medium text-ink-900 outline-none focus:border-primary-500"
                />
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink-900">
                Durasi Video (Menit:Detik)
              </label>
              <input
                type="text"
                value={durasi}
                onChange={(e) => setDurasi(e.target.value)}
                placeholder="Misal: 4:30 atau 12:10"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
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
              to="/admin/video"
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
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
