import { useEffect, useMemo, useState } from 'react';
import {
  CheckSquare, LifeBuoy, Radio, ShieldCheck, Compass,
  Heart, Wrench, Droplets, Phone, Lightbulb, CheckCircle2,
  Circle, RotateCcw, Ship, AlertTriangle,
  Shirt, FireExtinguisher, Smartphone, Map, Utensils, Flashlight,
  Cross, Fuel, Flame, type LucideIcon,
} from 'lucide-react';
import { supabase, type ChecklistCategoryDb, type ChecklistItemDb } from '../lib/supabase';

const iconMap: Record<string, LucideIcon> = {
  Shirt,
  FireExtinguisher,
  LifeBuoy,
  Flame,
  Flashlight,
  Compass,
  Radio,
  Smartphone,
  Map,
  Fuel,
  Ship,
  Droplets,
  Lightbulb,
  Heart,
  Utensils,
  Cross,
  Phone,
};

type ChecklistItem = {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  iconColor: string;
};

type ChecklistCategory = {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  items: ChecklistItem[];
};

const defaultCategories: ChecklistCategory[] = [
  {
    id: 'perlengkapan',
    title: 'Perlengkapan Keselamatan',
    desc: 'Wajib dibawa dan dipakai oleh setiap awak kapal',
    icon: LifeBuoy,
    color: 'from-red-500 to-rose-600',
    items: [
      { id: 'jaket', label: 'Jaket Pelampung', desc: 'Wajib tersedia 100% sesuai jumlah awak kapal dan sesuai standar SNI', icon: Shirt, iconColor: 'text-orange-500' },
      { id: 'apel', label: 'APAR (Alat Pemadam Api Ringan)', desc: 'Dalam masa berlaku, diletakkan mudah dijangkau', icon: FireExtinguisher, iconColor: 'text-red-500' },
      { id: 'pelampung', label: 'Pelampung Darurat', desc: 'Wajib, 50% jumlah awak kapal, tali apung 30 meter', icon: LifeBuoy, iconColor: 'text-orange-500' },
      { id: 'selimut', label: 'Selimut Pemadam Kebakaran', desc: '4 karung goni', icon: Flame, iconColor: 'text-red-500' },
      { id: 'lampu', label: 'Lampu Senter / Lampu Darurat', desc: 'Baterai penuh, untuk sinyal darurat', icon: Flashlight, iconColor: 'text-amber-500' },
    ],
  },
  {
    id: 'navigasi',
    title: 'Alat Navigasi & Komunikasi',
    desc: 'Memastikan kapal tetap terhubung & tepat arah',
    icon: Compass,
    color: 'from-sky-500 to-blue-600',
    items: [
      { id: 'gps', label: 'GPS / Kompas', desc: 'Minimal 1 unit, berfungsi dengan baik', icon: Compass, iconColor: 'text-red-500' },
      { id: 'radio', label: 'Radio Komunikasi (VHF/HF)', desc: 'Wajib 1 unit, frekuensi tersetel, siap komunikasi darurat', icon: Radio, iconColor: 'text-blue-700' },
      { id: 'hp', label: 'HP + Powerbank Penuh', desc: 'Pulsa cukup, sinyal darurat 112 aktif', icon: Smartphone, iconColor: 'text-blue-600' },
      { id: 'peta', label: 'Peta Laut / Chart', desc: 'Sesuai dengan daerah operasional penangkapan ikan', icon: Map, iconColor: 'text-emerald-600' },
    ],
  },
  {
    id: 'kapal',
    title: 'Kondisi Kapal',
    desc: 'Pemeriksaan teknis sebelum berlayar',
    icon: Ship,
    color: 'from-emerald-500 to-green-600',
    items: [
      { id: 'mesin', label: 'Mesin & Bahan Bakar', desc: 'Mesin normal, bahan bakar lebih dari cukup', icon: Fuel, iconColor: 'text-orange-600' },
      { id: 'lambung', label: 'Lambung Kapal', desc: 'Tidak ada kebocoran, katup tertutup rapat', icon: Ship, iconColor: 'text-blue-800' },
      { id: 'pompa', label: 'Pompa Bilga', desc: 'Berfungsi baik untuk menyedot air', icon: Droplets, iconColor: 'text-blue-500' },
      { id: 'lampu-nav', label: 'Lampu Navigasi', desc: 'Lampu merah-hijau-putih menyala', icon: Lightbulb, iconColor: 'text-amber-500' },
    ],
  },
  {
    id: 'pribadi',
    title: 'Kesiapan Pribadi Awak',
    desc: 'Kondisi kesehatan & logistik awak kapal',
    icon: Heart,
    color: 'from-amber-500 to-orange-600',
    items: [
      { id: 'kesehatan', label: 'Kondisi Kesehatan Prima', desc: 'Tidak ada yang sakit, cukup istirahat', icon: Heart, iconColor: 'text-red-500' },
      { id: 'makan', label: 'Logistik Makan & Minum', desc: 'Cukup untuk durasi melaut + cadangan', icon: Utensils, iconColor: 'text-amber-600' },
      { id: 'p3k', label: 'Kotak P3K', desc: 'Lengkap & tidak kadaluarsa', icon: Cross, iconColor: 'text-red-500' },
      { id: 'keluarga', label: 'Kabari Keluarga', desc: 'Beri tahu rencana & estimasi kembali', icon: Phone, iconColor: 'text-emerald-600' },
    ],
  },
];

const STORAGE_KEY = 'sikemas_checklist_v1';

export default function Checklist() {
  const [categoriesList, setCategoriesList] = useState<ChecklistCategory[]>(defaultCategories);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      supabase.from('checklist_categories').select('*').order('urutan', { ascending: true }),
      supabase.from('checklist_items').select('*').eq('is_active', true).order('urutan', { ascending: true }),
    ]).then(([catRes, itemRes]) => {
      if (catRes.data && catRes.data.length > 0 && itemRes.data) {
        const catDb = catRes.data as ChecklistCategoryDb[];
        const itemDb = itemRes.data as ChecklistItemDb[];

        const mapped: ChecklistCategory[] = catDb.map((cat) => {
          const catItems = itemDb
            .filter((item) => item.category_id === cat.id)
            .map((item) => ({
              id: item.id,
              label: item.label,
              desc: item.desc_text,
              icon: iconMap[item.icon] || LifeBuoy,
              iconColor: item.icon_color || 'text-orange-500',
            }));

          return {
            id: cat.id,
            title: cat.title,
            desc: cat.desc_text || '',
            icon: iconMap[cat.icon] || LifeBuoy,
            color: cat.color || 'from-red-500 to-rose-600',
            items: catItems,
          };
        });

        setCategoriesList(mapped);
      }
    });
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const totalItems = useMemo(
    () => categoriesList.reduce((acc, cat) => acc + cat.items.length, 0),
    [categoriesList]
  );

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const percent = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;
  const isComplete = checkedCount === totalItems && totalItems > 0;

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    if (window.confirm('Reset semua centang checklist?')) {
      setChecked({});
    }
  };

  return (
    <div className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-500 text-white shadow-md">
                <CheckSquare className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Checklist Keselamatan</h1>
                <p className="text-sm text-ink-500">Periksa perlengkapan sebelum kapal meninggalkan pelabuhan</p>
              </div>
            </div>
          </div>
          {checkedCount > 0 && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-xs font-bold text-ink-600 shadow-sm ring-1 ring-ink-200 hover:bg-ink-100 sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Centang
            </button>
          )}
        </div>

        {/* Progress Bar Card */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Progress Kesiapan Berlayar</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-ink-900 sm:text-5xl">{percent}%</span>
                <span className="text-sm font-semibold text-ink-500">
                  ({checkedCount} dari {totalItems} item terpenuhi)
                </span>
              </div>
            </div>
            {isComplete ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-secondary-50 px-4 py-3 text-sm font-bold text-secondary-700 ring-1 ring-secondary-200">
                <CheckCircle2 className="h-5 w-5 text-secondary-600" />
                Siap Berlayar! Semua item terpenuhi
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Lengkapi semua item sebelum melaut
              </div>
            )}
          </div>

          <div className="mt-6 h-3.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className={`h-full transition-all duration-500 ${
                isComplete ? 'bg-secondary-500' : percent > 50 ? 'bg-primary-600' : 'bg-amber-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-8">
          {categoriesList.map((cat) => {
            const CatIcon = cat.icon;
            const catCheckedCount = cat.items.filter((item) => checked[item.id]).length;
            const catComplete = catCheckedCount === cat.items.length && cat.items.length > 0;

            return (
              <div key={cat.id} className="overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-md`}>
                      <CatIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-ink-900 sm:text-xl">{cat.title}</h2>
                      <p className="text-xs text-ink-500 sm:text-sm">{cat.desc}</p>
                    </div>
                  </div>
                  <span className={`self-start rounded-full px-3 py-1 text-xs font-bold sm:self-auto ${
                    catComplete ? 'bg-secondary-50 text-secondary-700 ring-1 ring-secondary-200' : 'bg-ink-100 text-ink-600'
                  }`}>
                    {catCheckedCount}/{cat.items.length} Selesai
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {cat.items.map((item) => {
                    const isChecked = Boolean(checked[item.id]);
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggle(item.id)}
                        className={`group flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                          isChecked
                            ? 'border-secondary-200 bg-secondary-50/40 text-ink-900 shadow-sm'
                            : 'border-ink-100 bg-white hover:border-ink-300 hover:bg-ink-50/50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckCircle2 className="h-6 w-6 text-secondary-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-ink-300 group-hover:text-ink-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <ItemIcon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
                            <p className={`text-sm font-bold ${isChecked ? 'line-through text-ink-500' : 'text-ink-900'}`}>
                              {item.label}
                            </p>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-ink-500">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Note */}
        <div className="mt-10 rounded-2xl bg-amber-50 p-5 text-xs text-amber-900 ring-1 ring-amber-200/80 sm:text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Penting untuk diperhatikan:</p>
              <p className="mt-0.5">Jangan berlayar jika ada item belum terpenuhi. Keselamatan nyawa lebih utama daripada hasil tangkapan. Jika kondisi cuaca memburuk, segera kembali ke pelabuhan terdekat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
