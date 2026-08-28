import { useEffect, useMemo, useState } from 'react';
import {
  CheckSquare, LifeBuoy, Radio, ShieldCheck, Compass,
  Heart, Wrench, Droplets, Phone, Lightbulb, CheckCircle2,
  Circle, RotateCcw, Ship, AlertTriangle,
  Shirt, FireExtinguisher, Smartphone, Map, Utensils, Flashlight,
  Cross, Fuel, type LucideIcon,
} from 'lucide-react';


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

const categories: ChecklistCategory[] = [
  {
    id: 'perlengkapan',
    title: 'Perlengkapan Keselamatan',
    desc: 'Wajib dibawa dan dipakai oleh setiap awak kapal',
    icon: LifeBuoy,
    color: 'from-red-500 to-rose-600',
    items: [
      { id: 'jaket', label: 'Jaket Pelampung', desc: 'Untuk setiap awak kapal, sesuai standar SNI', icon: Shirt, iconColor: 'text-orange-500' },
      { id: 'apel', label: 'APAR (Alat Pemadam Api Ringan)', desc: 'Dalam masa berlaku, diletakkan mudah dijangkau', icon: FireExtinguisher, iconColor: 'text-red-500' },
      { id: 'pelampung', label: 'Pelampung Darurat', desc: 'Minimal 1 buah, siap digunakan', icon: LifeBuoy, iconColor: 'text-orange-500' },
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
      { id: 'gps', label: 'GPS / Kompas', desc: 'Berfungsi dengan baik, baterai penuh', icon: Compass, iconColor: 'text-red-500' },
      { id: 'radio', label: 'Radio Komunikasi (VHF/HF)', desc: 'Frekuensi tersetel, siap komunikasi darurat', icon: Radio, iconColor: 'text-blue-700' },
      { id: 'hp', label: 'HP + Powerbank Penuh', desc: 'Pulsa cukup, sinyal darurat 112 aktif', icon: Smartphone, iconColor: 'text-blue-600' },
      { id: 'peta', label: 'Peta Laut / Chart', desc: 'Versi terbaru, dilaminating', icon: Map, iconColor: 'text-emerald-600' },
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
  const [checked, setChecked] = useState<Record<string, boolean>>({});

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

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetAll = () => {
    if (confirm('Reset semua checklist?')) setChecked({});
  };

  const totalItems = useMemo(() => categories.reduce((n, c) => n + c.items.length, 0), []);
  const checkedCount = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const progress = Math.round((checkedCount / totalItems) * 100);
  const allDone = checkedCount === totalItems;

  return (
    <div className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-10">
        {/* Hero Header */}
        <div className="relative mb-8 flex overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: '410px' }}>

          {/* Left: content panel */}
          <div className="relative z-10 flex w-[58%] items-center px-10 py-14 sm:px-14">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5">
                <svg className="h-28 w-20 shrink-0" viewBox="0 0 72 96" fill="none" aria-hidden="true">
                  <rect x="6" y="10" width="54" height="80" rx="7" fill="white" stroke="#1d4ed8" strokeWidth="4" />
                  <rect x="22" y="3" width="22" height="16" rx="5" fill="white" stroke="#1d4ed8" strokeWidth="4" />
                  <path d="m15 34 4 4 7-8M31 34h22M15 50l4 4 7-8M31 50h22M15 66l4 4 7-8M31 66h22" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m48 86 14-14 6 6-14 14-9 3 3-9Z" fill="white" stroke="#f4b942" strokeWidth="3" strokeLinejoin="round" />
                  <path d="m62 72 2.5-2.5a2.5 2.5 0 0 1 3.5 0l1 1a2.5 2.5 0 0 1 0 3.5L66 77.5 62 72Z" fill="white" stroke="#d88924" strokeWidth="2" />
                </svg>

                <div className="min-w-0">
                  {/* Label */}
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-500 [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]">
                    Panduan Keselamatan Nelayan
                  </p>

                  {/* Title */}
                  <h1 className="font-header text-3xl font-extrabold leading-tight tracking-tight text-primary-900 whitespace-nowrap sm:text-[2.1rem] [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]">
                    Checklist Mandiri
                  </h1>
                  <h2 className="font-header text-2xl font-extrabold leading-tight tracking-tight text-primary-600 whitespace-nowrap sm:text-3xl [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]">
                    Keselamatan Berlayar
                  </h2>
                </div>
              </div>

              {/* Subtitle */}
              <p className="max-w-sm text-base leading-relaxed text-ink-600 sm:text-[0.95rem] [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]">
                Panduan mandiri untuk membantu Anda mempersiapkan pelayaran dengan lebih aman sebelum berlayar.
              </p>

              {/* Stat pills */}
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 shadow-md">
                  <CheckSquare className="h-4 w-4 text-white" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-white">{totalItems} Item Pemeriksaan</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-secondary-300 bg-secondary-50 px-4 py-2.5">
                  <ShieldCheck className="h-4 w-4 text-secondary-700" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-secondary-800">Standar BASARNAS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image and readability overlay */}
          <img
            src="/images/hero/WhatsApp_Image_2026-08-23_at_15.08.03.jpeg"
            alt="Kapal nelayan Indonesia"
            className="absolute inset-0 z-0 h-full w-full object-cover object-center" style={{ filter: 'brightness(1.1) contrast(1.06) saturate(1.05)' }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/70 via-white/55 to-transparent" />

        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink-700">Progres Kesiapan</p>
              <p className="text-2xl font-extrabold text-ink-900">{progress}%</p>
              <p className="text-xs text-ink-500">{checkedCount} dari {totalItems} item tercentang</p>
            </div>
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#eceef2" strokeWidth="3.5" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke={allDone ? '#0f9a5b' : '#1b7df5'}
                  strokeWidth="3.5"
                  strokeDasharray={`${(progress / 100) * 97.4} 97.4`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {allDone ? <CheckCircle2 className="h-7 w-7 text-secondary-500" /> : <span className="text-xs font-bold text-ink-700">{progress}%</span>}
              </div>
            </div>
          </div>
          {allDone && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-700 ring-1 ring-secondary-200">
              <CheckCircle2 className="h-5 w-5" />
              Semua siap! Tetap waspada dan selamat melaut.
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button onClick={resetAll} className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-200">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const catDone = cat.items.every((it) => checked[it.id]);
            return (
              <div key={cat.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-ink-100 p-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-md`}>
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-ink-900">{cat.title}</h2>
                    <p className="text-xs text-ink-500">{cat.desc}</p>
                  </div>
                  {catDone && <CheckCircle2 className="h-5 w-5 text-secondary-500" />}
                </div>
                <ul className="divide-y divide-ink-50">
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isChecked = !!checked[item.id];
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => toggle(item.id)}
                          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-ink-50/60"
                        >
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isChecked ? 'bg-secondary-100 text-secondary-600' : 'bg-ink-100 ' + item.iconColor}`}>
                            <ItemIcon className="h-5 w-5" strokeWidth={2.2} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${isChecked ? 'text-ink-500 line-through' : 'text-ink-900'}`}>{item.label}</p>
                            <p className="text-xs text-ink-500">{item.desc}</p>
                          </div>
                          {isChecked ? (
                            <CheckCircle2 className="h-6 w-6 text-secondary-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-ink-300" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Warning */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-amber-50 p-5 text-amber-800 ring-1 ring-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-bold">Penting!</p>
            <p className="mt-0.5">Jangan berlayar jika ada item belum terpenuhi. Keselamatan nyawa lebih utama daripada hasil tangkapan. Jika kondisi cuaca memburuk, segera kembali ke pelabuhan terdekat.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
