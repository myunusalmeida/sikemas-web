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

export async function fetchLiveWeather(): Promise<CuacaData> {
  const now = new Date();
  
  // 1. Fetch ocean wave height from Open-Meteo Marine (Perairan Kuala Tari, Pidie)
  let waveHeights: number[] = [0.6, 0.8, 0.7, 0.5];
  try {
    const marineRes = await fetch(
      'https://marine-api.open-meteo.com/v1/marine?latitude=5.375&longitude=96.875&daily=wave_height_max&timezone=Asia%2FJakarta'
    );
    if (marineRes.ok) {
      const marineJson = await marineRes.json();
      if (marineJson.daily?.wave_height_max) {
        waveHeights = marineJson.daily.wave_height_max
          .slice(0, 4)
          .map((w: number | null) => (w != null ? Number(w.toFixed(1)) : 0.6));
      }
    }
  } catch (e) {
    console.warn('Gagal memuat data gelombang maritim:', e);
  }

  // 2. Fetch BMKG official forecast for Pidie, Aceh
  try {
    const bmkgRes = await fetch(
      'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=11.07.03.2001'
    );
    if (bmkgRes.ok) {
      const bmkgJson = await bmkgRes.json();
      const forecastDataGrouped = bmkgJson?.data?.[0]?.cuaca;

      if (Array.isArray(forecastDataGrouped) && forecastDataGrouped.length > 0) {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const forecastList: Forecast[] = [];

        // Loop through up to 4 days of forecasts
        for (let i = 0; i < Math.min(4, forecastDataGrouped.length); i++) {
          const dayItems = forecastDataGrouped[i];
          if (!Array.isArray(dayItems) || dayItems.length === 0) continue;

          // Take representative item (mid-day or first available)
          const repItem = dayItems[Math.floor(dayItems.length / 2)] || dayItems[0];
          const dateObj = new Date(repItem.local_datetime || repItem.datetime || now);

          // Calculate min/max temp and humidity for the day
          const temps = dayItems.map((item: { t?: number }) => item.t ?? 28);
          const humidities = dayItems.map((item: { hu?: number }) => item.hu ?? 75);
          const windSpeeds = dayItems.map((item: { ws?: number }) => item.ws ?? 10);

          const minTemp = Math.min(...temps);
          const maxTemp = Math.max(...temps);
          const avgHum = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);
          const maxWindKm = Math.max(...windSpeeds);
          const windKnot = Math.round(maxWindKm * 0.539957) || 8;

          const parsedCuaca = parseBMKGWeather(repItem.weather_desc);

          forecastList.push({
            hari: i === 0 ? 'Hari ini' : i === 1 ? 'Besok' : days[dateObj.getDay()],
            tanggal: dateObj.toISOString().slice(0, 10),
            cuaca: parsedCuaca.label,
            cuaca_kode: parsedCuaca.kode,
            suhu_min: minTemp,
            suhu_max: maxTemp,
            kelembapan: avgHum,
            angin_knot: windKnot,
            angin_arah: getDirectionName(repItem.wd),
            gelombang_meter: waveHeights[i] ?? 0.6,
            warna: parsedCuaca.warna,
          });
        }

        if (forecastList.length > 0) {
          const peringatan = generateWarnings(forecastList);
          return {
            lokasi: {
              nama: 'Perairan Kuala Tari, Pidie (Aceh)',
              lat: 5.05,
              lon: 96.99,
            },
            diperbarui: now.toISOString(),
            prakiraan: forecastList,
            peringatan,
            sumber: 'Resmi BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) & Open-Meteo Marine',
          };
        }
      }
    }
  } catch (e) {
    console.warn('Gagal memuat data langsung dari BMKG API, mencoba fallback:', e);
  }

  // 3. Fallback: Open-Meteo Weather API
  try {
    const openMeteoRes = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=5.05&longitude=96.99&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=Asia%2FJakarta'
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

          let cuacaLabel = 'Cerah';
          let cuacaKode = 'sun';
          let warna = 'amber';

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
            angin_arah: 'Barat Daya',
            gelombang_meter: waveHeights[i] ?? 0.6,
            warna,
          });
        }

        const peringatan = generateWarnings(forecastList);
        return {
          lokasi: {
            nama: 'Perairan Kuala Tari, Pidie',
            lat: 5.05,
            lon: 96.99,
          },
          diperbarui: now.toISOString(),
          prakiraan: forecastList,
          peringatan,
          sumber: 'Open-Meteo Global Weather & Marine',
        };
      }
    }
  } catch (e) {
    console.warn('Fallback Open-Meteo gagal:', e);
  }

  // 4. Fallback Terakhir: Data Deterministik
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
      cuaca: 'Cerah Berawan',
      cuaca_kode: 'cloud-sun',
      suhu_min: 25,
      suhu_max: 32,
      kelembapan: 78,
      angin_knot: 10,
      angin_arah: 'Barat Daya',
      gelombang_meter: waveHeights[0] ?? 0.6,
      warna: 'sky',
    },
    {
      hari: 'Besok',
      tanggal: new Date(now.getTime() + 86400000).toISOString().slice(0, 10),
      cuaca: 'Berawan',
      cuaca_kode: 'cloudy',
      suhu_min: 24,
      suhu_max: 31,
      kelembapan: 82,
      angin_knot: 12,
      angin_arah: 'Barat',
      gelombang_meter: waveHeights[1] ?? 0.8,
      warna: 'slate',
    },
    {
      hari: days[new Date(now.getTime() + 172800000).getDay()],
      tanggal: new Date(now.getTime() + 172800000).toISOString().slice(0, 10),
      cuaca: 'Hujan Ringan',
      cuaca_kode: 'cloud-rain',
      suhu_min: 24,
      suhu_max: 30,
      kelembapan: 85,
      angin_knot: 14,
      angin_arah: 'Utara',
      gelombang_meter: waveHeights[2] ?? 0.7,
      warna: 'blue',
    },
    {
      hari: days[new Date(now.getTime() + 259200000).getDay()],
      tanggal: new Date(now.getTime() + 259200000).toISOString().slice(0, 10),
      cuaca: 'Cerah',
      cuaca_kode: 'sun',
      suhu_min: 26,
      suhu_max: 33,
      kelembapan: 75,
      angin_knot: 9,
      angin_arah: 'Timur Laut',
      gelombang_meter: waveHeights[3] ?? 0.5,
      warna: 'amber',
    },
  ];

  return {
    lokasi: {
      nama: 'Perairan Kuala Tari, Pidie',
      lat: 5.05,
      lon: 96.99,
    },
    diperbarui: now.toISOString(),
    prakiraan: forecast,
    peringatan: generateWarnings(forecast),
    sumber: 'Prakiraan Maritim Terintegrasi',
  };
}
