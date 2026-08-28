import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Newspaper, Clock, ArrowLeft, Share2, Calendar } from 'lucide-react';
import { LoadingState, ErrorState } from '../components/ui';
import { supabase, type Berita as BeritaType } from '../lib/supabase';

export default function BeritaDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<BeritaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('berita')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (!data) setError('Berita tidak ditemukan');
        else setItem(data);
        setLoading(false);
      });
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item?.judul, url: window.location.href });
      } catch {
        /* ignore */
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan disalin ke clipboard');
    }
  };

  if (loading) return <div className="container-app py-16"><LoadingState /></div>;
  if (error || !item) return <div className="container-app py-16"><ErrorState message={error ?? 'Berita tidak ditemukan'} /></div>;

  return (
    <article className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-10">
        <Link to="/berita" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
        </Link>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
          {item.gambar_url && (
            <div className="relative h-64 w-full overflow-hidden bg-ink-100 sm:h-80">
              <img src={item.gambar_url} alt={item.judul} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 font-bold uppercase tracking-wider text-primary-700">
                <Newspaper className="h-3.5 w-3.5" /> Berita
              </span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-3xl text-balance">
              {item.judul}
            </h1>
            {item.ringkasan && (
              <p className="mt-3 text-base font-medium text-ink-600">{item.ringkasan}</p>
            )}

            <div className="mt-6 border-t border-ink-100 pt-6">
              <div className="prose prose-sm max-w-none whitespace-pre-line text-ink-700 sm:prose-base">
                {item.konten}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
              <Link to="/berita" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
                <ArrowLeft className="h-4 w-4" /> Berita lainnya
              </Link>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-200"
              >
                <Share2 className="h-4 w-4" /> Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
