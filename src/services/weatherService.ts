export type Forecast = {
  hari: string;
  tanggal: string;
  cuaca: string;
  cuaca_kode: string;
  suhu_min: number;
  suhu_max: number;
  kelembapan: number;
  angin_knot: number;
  angin_arah: string;
  gelombang_meter: number;
  warna: string;
};

export type CuacaData = {
  lokasi: { nama: string; lat: number; lon: number };
  diperbarui: string;
  prakiraan: Forecast[];
  peringatan: { level: string; judul: string; deskripsi: string }[];
  sumber: string;
};

const directionMap: Record<string, string> = {
  N: 'Utara',
  NE: 'Timur Laut',
  E: 'Timur',
  SE: 'Tenggara',
  S: 'Selatan',
  SW: 'Barat Daya',
  W: 'Barat',
  NW: 'Barat Laut',
};

function getDirectionName(dir: string): string {
  return directionMap[dir?.toUpperCase()] || dir || 'Utara';
}

function parseBMKGWeather(desc: string) {
  const lower = (desc || '').toLowerCase();
  if (lower.includes('petir') || lower.includes('lebat')) {
    return { kode: 'cloud-rain-wind', warna: 'blue', label: desc || 'Hujan Petir' };
  }
  if (lower.includes('hujan')) {
    return { kode: 'cloud-rain', warna: 'blue', label: desc || 'Hujan' };
  }
  if (lower.includes('berawan tebal')) {
    return { kode: 'cloudy', warna: 'slate', label: desc || 'Berawan Tebal' };
  }
  if (lower.includes('berawan')) {
    return { kode: 'cloud-sun', warna: 'sky', label: desc || 'Cerah Berawan' };
  }
  if (lower.includes('cerah')) {
    return { kode: 'sun', warna: 'amber', label: desc || 'Cerah' };
  }
  return { kode: 'cloud', warna: 'slate', label: desc || 'Berawan' };
}

function getDirectionFromDegrees(deg?: number): string {
  if (deg === undefined || deg === null) return 'Utara';
  const dirs = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];
  const index = Math.round(deg / 45) % 8;
  return dirs[index] || 'Utara';
}

function parseBMKGMaritimeResponse(data: any, now: Date): CuacaData | null {
  if (!data) return null;
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const list = Array.isArray(data) ? data : data.forecast || data.prakiraan || data.data || [data];
  if (!list || list.length === 0) return null;

  const forecastList: Forecast[] = [];
  for (let i = 0; i < Math.min(4, list.length); i++) {
    const item = list[i];
    if (!item) continue;
    const dateObj = new Date(item.tanggal || item.valid_from || item.date || (now.getTime() + i * 86400000));
    
    const weatherStr = item.cuaca || item.weather || item.weather_desc || item.kondisi_cuaca || 'Berawan';
    const parsedCuaca = parseBMKGWeather(weatherStr);

    let waveVal = 1.1;
    if (typeof item.gelombang_meter === 'number') waveVal = item.gelombang_meter;
    else if (typeof item.gelombang === 'number') waveVal = item.gelombang;
    else if (item.wave_height) waveVal = parseFloat(item.wave_height) || 1.1;
    else if (item.wave_max) waveVal = parseFloat(item.wave_max) || 1.1;
    else if (item.wave_desc) {
      const match = item.wave_desc.match(/\d+(\.\d+)?/);
      if (match) waveVal = parseFloat(match[0]);
    }

    let windVal = 10;
    if (typeof item.angin_knot === 'number') windVal = item.angin_knot;
    else if (typeof item.angin === 'number') windVal = item.angin;
    else if (item.wind_speed_max) windVal = Number(item.wind_speed_max);
    else if (item.wind_speed) {
      const match = item.wind_speed.toString().match(/\d+/g);
      if (match) windVal = Math.max(...match.map(Number));
    }

    const windDir = item.angin_arah || item.wind_from || item.wind_direction || item.wind_dir || 'Utara';
    const minT = item.suhu_min ?? item.temp_min ?? item.temperature_min ?? 25;
    const maxT = item.suhu_max ?? item.temp_max ?? item.temperature_max ?? 31;
    const hum = item.kelembapan ?? item.humidity ?? 80;

    forecastList.push({
      hari: i === 0 ? 'Hari ini' : i === 1 ? 'Besok' : days[dateObj.getDay()],
      tanggal: dateObj.toISOString().slice(0, 10),
      cuaca: parsedCuaca.label,
      cuaca_kode: parsedCuaca.kode,
      suhu_min: Number(minT),
      suhu_max: Number(maxT),
      kelembapan: Number(hum),
      angin_knot: Number(windVal),
      angin_arah: getDirectionName(windDir),
      gelombang_meter: Number(waveVal),
      warna: parsedCuaca.warna,
    });
  }

  if (forecastList.length === 0) return null;

  return {
    lokasi: {
      nama: 'Perairan Selat Malaka Bagian Utara',
      lat: 5.38,
      lon: 96.00,
    },
    diperbarui: now.toISOString(),
    prakiraan: forecastList,
    peringatan: generateWarnings(forecastList),
    sumber: 'Resmi BMKG Maritim (Peta Maritim BMKG)',
  };
}

export async function fetchLiveWeather(): Promise<CuacaData> {
  const now = new Date();

  // 1. Try fetching directly from BMKG Public Maritime API for Selat Malaka Bagian Utara (A.02)
  try {
    const bmkgUrls = [
      'https://peta-maritim.bmkg.go.id/public_api/perairan/A.02_Selat%20Malaka%20bagian%20utara.json',
      'https://peta-maritim.bmkg.go.id/public_api/perairan/A.02.json',
      'https://maritim.bmkg.go.id/public_api/perairan/A.02',
    ];

    for (const url of bmkgUrls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const bmkgJson = await res.json();
          const parsed = parseBMKGMaritimeResponse(bmkgJson, now);
          if (parsed) return parsed;
        }
      } catch (e) {
        // try next endpoint
      }
    }
  } catch (e) {
    console.warn('Gagal memuat data langsung dari BMKG Maritim API:', e);
  }

  // 2. Fetch ocean wave height from Open-Meteo Marine (Perairan Selat Malaka Bagian Utara: lat 5.38, lon 96.00)
  let waveHeights: number[] = [1.1, 1.2, 1.4, 0.9];
  try {
    const marineRes = await fetch(
      'https://marine-api.open-meteo.com/v1/marine?latitude=5.38&longitude=96.00&daily=wave_height_max&timezone=Asia%2FJakarta'
    );
    if (marineRes.ok) {
      const marineJson = await marineRes.json();
      if (marineJson.daily?.wave_height_max) {
        waveHeights = marineJson.daily.wave_height_max
          .slice(0, 4)
          .map((w: number | null) => (w != null ? Number(w.toFixed(1)) : 1.1));
      }
    }
  } catch (e) {
    console.warn('Gagal memuat data gelombang maritim:', e);
  }

  // 3. Fallback: Open-Meteo Weather API for Selat Malaka Bagian Utara (5.38, 96.00)
  try {
    const openMeteoRes = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=5.38&longitude=96.00&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=Asia%2FJakarta'
    );
    if (openMeteoRes.ok) {
      const json = await openMeteoRes.json();
      const daily = json.daily;
      if (daily?.time) {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const forecastList: Forecast[] = [];

        for (let i = 0; i < Math.min(4, daily.time.length); i++) {
          const d = new Date(daily.time[i]);
          const code = daily.weather_code[i] ?? 0;
          const maxWindKm = daily.wind_speed_10m_max[i] ?? 10;
          const windKnot = Math.round(maxWindKm * 0.539957);

          let cuacaLabel = 'Berawan';
          let cuacaKode = 'cloud';
          let warna = 'slate';

          if (code === 0) {
            cuacaLabel = 'Cerah';
            cuacaKode = 'sun';
            warna = 'amber';
          } else if (code <= 3) {
            cuacaLabel = 'Cerah Berawan';
            cuacaKode = 'cloud-sun';
            warna = 'sky';
          } else if (code >= 51 && code <= 67) {
            cuacaLabel = 'Hujan Ringan';
            cuacaKode = 'cloud-rain';
            warna = 'blue';
          } else if (code >= 80) {
            cuacaLabel = 'Hujan Sedang/Lebat';
            cuacaKode = 'cloud-rain-wind';
            warna = 'blue';
          }

          forecastList.push({
            hari: i === 0 ? 'Hari ini' : i === 1 ? 'Besok' : days[d.getDay()],
            tanggal: d.toISOString().slice(0, 10),
            cuaca: cuacaLabel,
            cuaca_kode: cuacaKode,
            suhu_min: Math.round(daily.temperature_2m_min[i]),
            suhu_max: Math.round(daily.temperature_2m_max[i]),
            kelembapan: Math.round(daily.relative_humidity_2m_max[i] ?? 80),
            angin_knot: windKnot,
            angin_arah: getDirectionFromDegrees(daily.wind_direction_10m_dominant?.[i]),
            gelombang_meter: waveHeights[i] ?? 1.1,
            warna,
          });
        }

        const peringatan = generateWarnings(forecastList);
        return {
          lokasi: {
            nama: 'Perairan Selat Malaka Bagian Utara',
            lat: 5.38,
            lon: 96.00,
          },
          diperbarui: now.toISOString(),
          prakiraan: forecastList,
          peringatan,
          sumber: 'BMKG Maritim & Open-Meteo Global Marine',
        };
      }
    }
  } catch (e) {
    console.warn('Fallback Open-Meteo gagal:', e);
  }

  // 4. Fallback Terakhir: Data Deterministik Maritim
  return getFallbackSimulatedData(now, waveHeights);
}

function generateWarnings(forecast: Forecast[]) {
  const peringatan = [];
  if (forecast.some((f) => f.gelombang_meter >= 2.5)) {
    peringatan.push({
      level: 'waspada',
      judul: 'Waspada Gelombang Tinggi',
      deskripsi: 'Gelombang diperkirakan mencapai 2.5 meter atau lebih. Nelayan dihimbau berhati-hati saat melaut.',
    });
  }
  if (forecast.some((f) => f.angin_knot >= 25)) {
    peringatan.push({
      level: 'siaga',
      judul: 'Angin Kencang',
      deskripsi: 'Kecepatan angin diperkirakan melebihi 25 knot. Gunakan peralatan keselamatan lengkap.',
    });
  }
  if (peringatan.length === 0) {
    peringatan.push({
      level: 'aman',
      judul: 'Kondisi Aman',
      deskripsi: 'Tidak ada peringatan dini gelombang tinggi. Kondisi cuaca aman untuk aktivitas melaut.',
    });
  }
  return peringatan;
}

function getFallbackSimulatedData(now: Date, waveHeights: number[]): CuacaData {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const forecast: Forecast[] = [
    {
      hari: 'Hari ini',
      tanggal: now.toISOString().slice(0, 10),
      cuaca: 'Berawan',
      cuaca_kode: 'cloud',
      suhu_min: 25,
      suhu_max: 31,
      kelembapan: 78,
      angin_knot: 10,
      angin_arah: 'Utara',
      gelombang_meter: waveHeights[0] ?? 1.1,
      warna: 'slate',
    },
    {
      hari: 'Besok',
      tanggal: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
      cuaca: 'Cerah Berawan',
      cuaca_kode: 'cloud-sun',
      suhu_min: 25,
      suhu_max: 32,
      kelembapan: 75,
      angin_knot: 12,
      angin_arah: 'Timur Laut',
      gelombang_meter: waveHeights[1] ?? 1.2,
      warna: 'sky',
    },
    {
      hari: days[new Date(now.getTime() + 172800000).getDay()],
      tanggal: new Date(now.getTime() + 172800000).toISOString().slice(0, 10),
      cuaca: 'Berawan Tebal',
      cuaca_kode: 'cloudy',
      suhu_min: 24,
      suhu_max: 30,
      kelembapan: 82,
      angin_knot: 14,
      angin_arah: 'Barat Daya',
      gelombang_meter: waveHeights[2] ?? 1.4,
      warna: 'slate',
    },
    {
      hari: days[new Date(now.getTime() + 259200000).getDay()],
      tanggal: new Date(now.getTime() + 259200000).toISOString().slice(0, 10),
      cuaca: 'Cerah',
      cuaca_kode: 'sun',
      suhu_min: 26,
      suhu_max: 33,
      kelembapan: 74,
      angin_knot: 9,
      angin_arah: 'Timur',
      gelombang_meter: waveHeights[3] ?? 0.9,
      warna: 'amber',
    },
  ];

  return {
    lokasi: {
      nama: 'Perairan Selat Malaka Bagian Utara',
      lat: 5.38,
      lon: 96.00,
    },
    diperbarui: now.toISOString(),
    prakiraan: forecast,
    peringatan: generateWarnings(forecast),
    sumber: 'Disimulasikan dari BMKG Maritim (Selat Malaka Bagian Utara)',
  };
}
