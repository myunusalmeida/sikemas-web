import { useEffect, useState } from 'react';
import {
  Cloud, CloudRain, CloudSun, Cloudy, Sun, Wind, Waves,
  Droplets, Thermometer, Compass, AlertTriangle, ShieldCheck,
  RefreshCw, MapPin, Clock, type LucideIcon } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState } from '../components/ui';

import { fetchLiveWeather, type CuacaData, type Forecast } from '../services/weatherService';

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  cloud: Cloud,
  'cloud-sun': CloudSun,
  cloudy: Cloudy,
  'cloud-rain': CloudRain,
  'cloud-rain-wind': CloudRain,
};

function getWarnaClasses(warna: string) {
  const map: Record<string, string> = {
    amber: 'from-amber-400 to-orange-500',
    slate: 'from-slate-400 to-slate-600',
    sky: 'from-sky-400 to-blue-500',
    blue: 'from-blue-500 to-indigo-600',
  };
  return map[warna] ?? 'from-sky-400 to-blue-500';
}

function levelClasses(level: string) {
  if (level === 'aman') return { bg: 'bg-secondary-50', text: 'text-secondary-700', ring: 'ring-secondary-200', icon: ShieldCheck };
  if (level === 'waspada') return { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', icon: AlertTriangle };
  return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', icon: AlertTriangle };
}

export default function InfoCuaca() {
  const [data, setData] = useState<CuacaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    
    // Check if Supabase Edge Function is available, or fetch directly from live BMKG API
    const edgeUrl = import.meta.env.VITE_SUPABASE_URL ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cuaca-maritim?lat=5.05&lon=96.99` : null;
    
    if (edgeUrl) {
      fetch(edgeUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Edge function status ${res.status}`);
          const json = await res.json();
          if (json.error) throw new Error(json.error);
          setData(json);
        })
        .catch(() => {
          // If Supabase edge function is not deployed yet (e.g. 404), seamlessly fetch live BMKG API data
          fetchLiveWeather()
            .then(setData)
            .catch((e) => setError(e.message));
        })
        .finally(() => setLoading(false));
    } else {
      fetchLiveWeather()
        .then(setData)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-primary-700 to-primary-900 pb-16 pt-12 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="container-app relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <Cloud className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Info Cuaca Maritim</h1>
              <p className="text-sm text-primary-100">Prakiraan cuaca & gelombang untuk nelayan</p>
            </div>
          </div>
          {data && (
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-primary-100">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {data.lokasi.nama}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Diperbarui {new Date(data.diperbarui).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              <button onClick={fetchData} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold ring-1 ring-white/20 hover:bg-white/20">
                <RefreshCw className="h-3.5 w-3.5" /> Muat ulang
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container-app -mt-8 relative">
        {loading && <LoadingState label="Memuat prakiraan cuaca..." />}
        {error && <ErrorState message={error} />}
        {data && !loading && !error && (
          <div className="space-y-8 pb-8">
            {/* Peringatan */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.peringatan.map((p, i) => {
                const c = levelClasses(p.level);
                const Icon = c.icon;
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-2xl ${c.bg} p-4 ring-1 ${c.ring}`}>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ${c.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${c.text}`}>{p.judul}</p>
                      <p className="mt-0.5 text-xs text-ink-600">{p.deskripsi}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prakiraan hari ini - besar */}
            {data.prakiraan[0] && (
              <TodayCard forecast={data.prakiraan[0]} />
            )}

            {/* Prakiraan 4 hari */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink-900">Prakiraan 4 Hari ke Depan</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.prakiraan.map((f, i) => (
                  <ForecastCard key={i} forecast={f} />
                ))}
              </div>
            </div>

            {/* Parameter detail */}
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink-900">Parameter Maritim Hari Ini</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ParamCard icon={Thermometer} label="Suhu Udara" value={`${data.prakiraan[0].suhu_min}° - ${data.prakiraan[0].suhu_max}°C`} color="from-orange-400 to-red-500" />
                <ParamCard icon={Droplets} label="Kelembapan" value={`${data.prakiraan[0].kelembapan}%`} color="from-cyan-400 to-blue-500" />
                <ParamCard icon={Wind} label="Kecepatan Angin" value={`${data.prakiraan[0].angin_knot} knot`} color="from-emerald-400 to-teal-500" />
                <ParamCard icon={Waves} label="Tinggi Gelombang" value={`${data.prakiraan[0].gelombang_meter} m`} color="from-sky-400 to-indigo-500" />
              </div>
            </div>

            <p className="text-center text-xs text-ink-400">
              Data {data.sumber}. Untuk keputusan melaut, selalu rujuk pengumuman resmi BMKG & Syahbandar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TodayCard({ forecast }: { forecast: Forecast }) {
  const Icon = iconMap[forecast.cuaca_kode] ?? Cloud;
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 p-6 text-white shadow-xl sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${getWarnaClasses(forecast.warna)} shadow-lg`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-200">Hari Ini</p>
            <p className="text-3xl font-extrabold">{forecast.cuaca}</p>
            <p className="mt-1 text-primary-100">{forecast.suhu_min}° - {forecast.suhu_max}°C</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6">
          <MiniStat icon={Wind} label="Angin" value={`${forecast.angin_knot} kt`} />
          <MiniStat icon={Compass} label="Arah" value={forecast.angin_arah} />
          <MiniStat icon={Waves} label="Gelombang" value={`${forecast.gelombang_meter} m`} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-5 w-5 text-secondary-300" />
      <p className="mt-1 text-base font-bold">{value}</p>
      <p className="text-xs text-primary-200">{label}</p>
    </div>
  );
}

function ForecastCard({ forecast }: { forecast: Forecast }) {
  const Icon = iconMap[forecast.cuaca_kode] ?? Cloud;
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink-900">{forecast.hari}</p>
        <p className="text-xs text-ink-400">{new Date(forecast.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
      </div>
      <div className={`mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${getWarnaClasses(forecast.warna)} shadow-md`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-ink-800">{forecast.cuaca}</p>
      <div className="mt-3 space-y-1.5 text-xs text-ink-500">
        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Thermometer className="h-3.5 w-3.5" /> Suhu</span><span className="font-semibold text-ink-700">{forecast.suhu_min}°-{forecast.suhu_max}°</span></div>
        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Wind className="h-3.5 w-3.5" /> Angin</span><span className="font-semibold text-ink-700">{forecast.angin_knot} kt</span></div>
        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1"><Waves className="h-3.5 w-3.5" /> Gelombang</span><span className="font-semibold text-ink-700">{forecast.gelombang_meter} m</span></div>
      </div>
    </div>
  );
}

function ParamCard({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs font-medium text-ink-500">{label}</p>
    </div>
  );
}
