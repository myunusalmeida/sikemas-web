import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, CheckSquare, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type ChecklistCategoryDb, type ChecklistItemDb } from '../../lib/supabase';
import { PageHeader, LoadingState, EmptyState } from '../../components/ui';

export default function AdminChecklist() {
  const [categories, setCategories] = useState<ChecklistCategoryDb[]>([]);
  const [items, setItems] = useState<ChecklistItemDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const fetchData = async () => {
    setLoading(true);
    const [catRes, itemRes] = await Promise.all([
      supabase.from('checklist_categories').select('*').order('urutan', { ascending: true }),
      supabase.from('checklist_items').select('*').order('urutan', { ascending: true }),
    ]);

    if (catRes.data) setCategories(catRes.data as ChecklistCategoryDb[]);
    if (itemRes.data) setItems(itemRes.data as ChecklistItemDb[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (item: ChecklistItemDb) => {
    const nextStatus = !item.is_active;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_active: nextStatus } : i))
    );

    await supabase.from('checklist_items').update({ is_active: nextStatus }).eq('id', item.id);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus item checklist ini?')) return;
    setDeletingId(id);
    await supabase.from('checklist_items').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDeletingId(null);
  };

  const handleMoveOrder = async (categoryItems: ChecklistItemDb[], index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoryItems.length) return;

    const currentItem = categoryItems[index];
    const targetItem = categoryItems[targetIndex];

    const tempUrutan = currentItem.urutan;
    currentItem.urutan = targetItem.urutan;
    targetItem.urutan = tempUrutan;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === currentItem.id) return { ...item, urutan: currentItem.urutan };
        if (item.id === targetItem.id) return { ...item, urutan: targetItem.urutan };
        return item;
      })
    );

    await Promise.all([
      supabase.from('checklist_items').update({ urutan: currentItem.urutan }).eq('id', currentItem.id),
      supabase.from('checklist_items').update({ urutan: targetItem.urutan }).eq('id', targetItem.id),
    ]);

    fetchData();
  };

  const filteredCategories = activeTab === 'all'
    ? categories
    : categories.filter((c) => c.id === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Kelola Checklist Keselamatan CMS"
          subtitle="Atur kategori dan daftar item pemeriksaan keselamatan melaut"
        />
        <Link
          to="/admin/checklist/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 sm:self-start"
        >
          <Plus className="h-4 w-4" /> Tambah Item Checklist
        </Link>
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-ink-600 hover:bg-ink-100 ring-1 ring-ink-200'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === cat.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-ink-600 hover:bg-ink-100 ring-1 ring-ink-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {loading && <LoadingState label="Memuat checklist keselamatan..." />}

      {!loading && items.length === 0 && (
        <EmptyState
          title="Belum ada item checklist"
          description="Tambahkan item checklist keselamatan pertama."
          actionLabel="Tambah Item Baru"
          onAction={() => window.location.assign('/admin/checklist/new')}
        />
      )}

      {!loading && filteredCategories.map((cat) => {
        const catItems = items
          .filter((i) => i.category_id === cat.id)
          .sort((a, b) => a.urutan - b.urutan);

        return (
          <div key={cat.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/70 px-6 py-4">
              <div>
                <h2 className="font-extrabold text-ink-900 text-base">{cat.title}</h2>
                <p className="text-xs text-ink-500">{cat.desc_text}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-700 shadow-sm ring-1 ring-ink-200">
                {catItems.length} Item
              </span>
            </div>

            {catItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-ink-400">Belum ada item di kategori ini.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-ink-700">
                  <thead className="bg-ink-50/40 text-xs font-bold uppercase tracking-wider text-ink-400">
                    <tr>
                      <th className="px-6 py-3">Nama Item</th>
                      <th className="px-6 py-3">Deskripsi / Persyaratan</th>
                      <th className="px-6 py-3">Urutan</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {catItems.map((item, idx) => (
                      <tr key={item.id} className="transition-colors hover:bg-ink-50/40">
                        <td className="px-6 py-4 font-bold text-ink-900 max-w-xs">
                          {item.label}
                        </td>
                        <td className="px-6 py-4 text-xs text-ink-600 max-w-md">
                          {item.desc_text}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-xs font-bold text-ink-800">
                              {item.urutan}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveOrder(catItems, idx, 'up')}
                                className="rounded p-0.5 text-ink-400 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-30"
                                title="Naikkan urutan"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === catItems.length - 1}
                                onClick={() => handleMoveOrder(catItems, idx, 'down')}
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
                            onClick={() => handleToggleActive(item)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                              item.is_active
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {item.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            {item.is_active ? 'Tampil' : 'Sembunyi'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/checklist/${item.id}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-primary-50 hover:text-primary-700 transition"
                              title="Edit Item"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              disabled={deletingId === item.id}
                              onClick={() => handleDeleteItem(item.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                              title="Hapus Item"
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
            )}
          </div>
        );
      })}
    </div>
  );
}
