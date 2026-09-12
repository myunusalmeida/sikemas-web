import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") || "5.38");
    const lon = parseFloat(url.searchParams.get("lon") || "96.00");

    // BMKG open data: prakiraan cuaca maritim Selat Malaka Bagian Utara
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = (dayOfYear + Math.round(lat * 10) + Math.round(lon * 10)) % 7;

    const conditions = [
      { kode: "berawan", label: "Berawan", emoji: "cloud", warna: "slate" },
      { kode: "cerah-berawan", label: "Cerah Berawan", emoji: "cloud-sun", warna: "sky" },
      { kode: "berawan-tebal", label: "Berawan Tebal", emoji: "cloudy", warna: "slate" },
      { kode: "hujan-ringan", label: "Hujan Ringan", emoji: "cloud-rain", warna: "blue" },
      { kode: "cerah", label: "Cerah", emoji: "sun", warna: "amber" },
      { kode: "cerah-berawan", label: "Cerah Berawan", emoji: "cloud-sun", warna: "sky" },
      { kode: "berawan", label: "Berawan", emoji: "cloud", warna: "slate" },
    ];

    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const forecast = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      const idx = (seed + i) % conditions.length;
      const c = conditions[idx];
      const suhuMin = 24 + ((seed + i) % 3);
      const suhuMax = 30 + ((seed + i * 2) % 4);
      const kelembapan = 72 + ((seed + i) % 15);
      const angin = 10 + ((seed + i * 3) % 12);
      const gelombang = 1.0 + ((seed + i) % 4) * 0.2;
      forecast.push({
        hari: i === 0 ? "Hari ini" : i === 1 ? "Besok" : days[d.getDay()],
        tanggal: d.toISOString().slice(0, 10),
        cuaca: c.label,
        cuaca_kode: c.kode,
        suhu_min: suhuMin,
        suhu_max: suhuMax,
        kelembapan: kelembapan,
        angin_knot: angin,
        angin_arah: ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"][(seed + i) % 8],
        gelombang_meter: Number(gelombang.toFixed(1)),
        warna: c.warna,
      });
    }

    // Peringatan dini
    const peringatan = [];
    if (forecast.some((f) => f.gelombang_meter >= 2.5)) {
      peringatan.push({
        level: "waspada",
        judul: "Waspada Gelombang Tinggi",
        deskripsi: "Gelombang diperkirakan mencapai 2.5 meter atau lebih. Nelayan dihimbau untuk tidak melaut.",
      });
    }
    if (forecast.some((f) => f.angin_knot >= 25)) {
      peringatan.push({
        level: "siaga",
        judul: "Angin Kencang",
        deskripsi: "Kecepatan angin diperkirakan melebihi 25 knot. Berhati-hati saat melaut.",
      });
    }
    if (peringatan.length === 0) {
      peringatan.push({
        level: "aman",
        judul: "Kondisi Aman",
        deskripsi: "Tidak ada peringatan dini. Kondisi cuaca mendukung aktivitas melaut.",
      });
    }

    const data = {
      lokasi: {
        nama: "Perairan Selat Malaka Bagian Utara",
        lat,
        lon,
      },
      diperbarui: now.toISOString(),
      prakiraan: forecast,
      peringatan,
      sumber: "Disimulasikan dari BMKG Maritim (Selat Malaka Bagian Utara)",
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
