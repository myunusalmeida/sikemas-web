import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Video as VideoIcon, Play, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type VideoDb } from '../../lib/supabase';
import { PageHeader, LoadingState, EmptyState } from '../../components/ui';

export default function AdminVideo() {
  const [videos, setVideos] = useState<VideoDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('Semua');

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('urutan', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVideos(data as VideoDb[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleToggleActive = async (video: VideoDb) => {
    const nextStatus = !video.is_active;
    setVideos((prev) =>
      prev.map((item) => (item.id === video.id ? { ...item, is_active: nextStatus } : item))
    );

    await supabase.from('videos').update({ is_active: nextStatus }).eq('id', video.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus video ini?')) return;
    setDeletingId(id);
    await supabase.from('videos').delete().eq('id', id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setDeletingId(null);
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const newVideos = [...videos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newVideos.length) return;

    const currentItem = newVideos[index];
    const targetItem = newVideos[targetIndex];

    const tempUrutan = currentItem.urutan;
    currentItem.urutan = targetItem.urutan;
    targetItem.urutan = tempUrutan;

    setVideos(newVideos);

    await Promise.all([
      supabase.from('videos').update({ urutan: currentItem.urutan }).eq('id', currentItem.id),
      supabase.from('videos').update({ urutan: targetItem.urutan }).eq('id', targetItem.id),
    ]);

    fetchVideos();
  };

  const categories = ['Semua', ...Array.from(new Set(videos.map((v) => v.kategori)))];
  const filteredVideos = filterCategory === 'Semua' ? videos : videos.filter((v) => v.kategori === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Kelola Video Edukasi CMS"
          subtitle="Tambah, ubah, atau atur daftar video edukasi keselamatan dan kategori untuk nelayan"
        />
        <Link
          to="/admin/video/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 sm:self-start"
        >
          <Plus className="h-4 w-4" /> Tambah Video Baru
        </Link>
      </div>

      {/* Filter Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-ink-600 hover:bg-ink-100 ring-1 ring-ink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading && <LoadingState label="Memuat daftar video edukasi..." />}

      {!loading && videos.length === 0 && (
        <EmptyState
          title="Belum ada video edukasi"
          description="Tambahkan video Youtube pertama untuk ditampilkan di halaman Video Edukasi."
          actionLabel="Tambah Video Baru"
          onAction={() => window.location.assign('/admin/video/new')}
        />
      )}

      {!loading && videos.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-700">
              <thead className="bg-ink-50/70 text-xs font-bold uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-6 py-4">Thumbnail</th>
                  <th className="px-6 py-4">Judul & Kategori</th>
                  <th className="px-6 py-4">Durasi</th>
                  <th className="px-6 py-4">Urutan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filteredVideos.map((video, idx) => (
                  <tr key={video.id} className="transition-colors hover:bg-ink-50/40">
                    <td className="px-6 py-4">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block h-16 w-28 overflow-hidden rounded-xl bg-ink-900 ring-1 ring-ink-200"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                          alt={video.judul}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="h-6 w-6 fill-white text-white drop-shadow" />
                        </div>
                      </a>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-bold text-primary-700 ring-1 ring-primary-200/50">
                        {video.kategori}
                      </span>
                      <p className="mt-1 font-bold text-ink-900 line-clamp-1">{video.judul}</p>
                      <p className="text-xs text-ink-500 line-clamp-1">{video.deskripsi}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-ink-600">
                      {video.durasi || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-xs font-bold text-ink-800">
                          {video.urutan}
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
                            disabled={idx === filteredVideos.length - 1}
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
                        onClick={() => handleToggleActive(video)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          video.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {video.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {video.is_active ? 'Tampil' : 'Sembunyi'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/video/${video.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-primary-50 hover:text-primary-700 transition"
                          title="Edit Video"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === video.id}
                          onClick={() => handleDelete(video.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                          title="Hapus Video"
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
