import { useState } from 'react';
import {
  Heart, Phone, AlertTriangle, Droplets, Wind, ShieldCheck,
  ChevronDown, Activity, Flame, Waves, Bone, Sun, Bug, Ship, type LucideIcon,
} from 'lucide-react';

type Step = { judul: string; desc: string; gambar?: string; card?: boolean };

type P3KItem = {
  id: string;
  judul: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  darurat?: boolean;
  langkah: Step[];
  catatan?: string;
  tandaGejala?: string[];
};

const items: P3KItem[] = [
  {
    id: 'tenggelam',
    judul: 'Orang Jatuh ke Laut',
    desc: 'Jika ada orang yang jatuh ke laut, tindakan cepat dan tepat sangat penting untuk menyelamatkan nyawanya.',
    icon: Waves,
    color: 'from-sky-500 to-blue-600',
    darurat: true,
    langkah: [
      { judul: 'Lempar Pelampung atau Benda Apung', desc: 'Segera lempar pelampung, ban, jerigen kosong, atau benda apung lainnya ke arah korban.', gambar: '/images/WhatsApp_Image_2026-07-23_at_19.40.04_(1).jpeg' },
      { judul: 'Tarik Korban ke Arah Kapal dengan Aman', desc: `Dekati korban dari arah belakang atau samping,\ngunakan tali atau alat bantu untuk menarik korban ke kapal.`, gambar: '/images/WhatsApp_Image_2026-07-23_at_19.40.04.jpeg' },
      { judul: 'Pastikan Korban dalam Keadaan Sadar', desc: `Tanyakan nama korban,\ngoyangkan bahu korban perlahan sambil bicara dengan suara keras.`, gambar: '/images/WhatsApp_Image_2026-07-23_at_19.40.05.jpeg' },
      { judul: 'Berikan Pertolongan Sesuai Kondisi Korban', desc: `Jika pingsan tapi bernafas, baringkan dan miringkan tubuh.\nJika tidak bernafas, lakukan CPR.\nJika kedinginan, keringkan tubuh dan selimuti dengan kain.`, gambar: '/images/WhatsApp_Image_2026-07-23_at_19.40.06.jpeg' },
      { judul: 'Segera Bawa ke Fasilitas Kesehatan Terdekat', desc: `Setelah kondisi stabil, segera bawa korban ke fasilitas terdekat.\nPantau terus kondisi korban selama perjalanan.`, gambar: '/images/WhatsApp_Image_2026-07-23_at_19.40.07.jpeg' },
    ],
  },
  {
    id: 'kapal-bocor',
    judul: 'Kapal Bocor / Kemasukan Air',
    desc: 'Kapal bocor atau kemasukan air akibat cuaca buruk, benturan, atau kerusakan lambung. Tindakan cepat dan tepat penting mencegah kapal tenggelam.',
    icon: Ship,
    color: 'from-blue-600 to-cyan-700',
    darurat: true,
    langkah: [
      { judul: 'Berikan Peringatan', desc: 'Tetap tenang, beri tahu seluruh kru, dan gunakan jaket pelampung.', gambar: '/images/kapal-bocor/langkah-1-berikan-peringatan.webp' },
      { judul: 'Temukan Sumber Bocor', desc: 'Periksa lambung, palka, sambungan, dan pipa untuk temukan sumber bocor.', gambar: '/images/kapal-bocor/langkah-2-temukan-sumber-bocor.webp' },
      { judul: 'Tutup / Kendalikan Bocor', desc: 'Gunakan papan, kain, sumbat kayu, atau sealant untuk menutup lubang.', gambar: '/images/kapal-bocor/langkah-3-tutup-bocor.webp' },
      { judul: 'Buang Air Masuk', desc: 'Gunakan pompa air atau ember untuk membuang air keluar terus-menerus.', gambar: '/images/kapal-bocor/langkah-4-buang-air.webp' },
      { judul: 'Stabilisasi Kapal', desc: 'Kurangi beban berlebih, amankan barang, jaga keseimbangan kapal tetap stabil.', gambar: '/images/kapal-bocor/langkah-5-stabilisasi-kapal.webp' },
      { judul: 'Minta Bantuan', desc: 'Hubungi kapal terdekat atau BASARNAS/Polairud melalui radio/telepon.', gambar: '/images/kapal-bocor/langkah-6-minta-bantuan.webp' },
    ],
    tandaGejala: [
      'Air masuk ke dalam palka atau geladak bagian dalam',
      'Kapal terasa miring atau tidak stabil',
      'Pompa air bekerja terus-menerus',
      'Penurunan ketinggian air laut di lambung kapal',
    ],
  },
  {
    id: 'kebakaran',
    judul: 'Kebakaran di Kapal',
    desc: 'Kebakaran di kapal dapat terjadi kapan saja. Tindakan cepat dan tepat sangat penting untuk menyelamatkan jiwa dan meminimalkan kerusakan.',
    icon: Flame,
    color: 'from-red-500 to-orange-600',
    darurat: true,
    langkah: [
      { judul: 'Berikan Peringatan', desc: 'Jangan panik, tetap tenang dan segera beri tahu seluruh kru tentang adanya kebakaran.', gambar: '/images/kebakaran/langkah-1-berikan-peringatan.webp' },
      { judul: 'Matikan Sumber Listrik & Bahan Bakar', desc: 'Matikan listrik utama, kompor, mesin, dan tutup katup bahan bakar.', gambar: '/images/kebakaran/langkah-2-matikan-listrik.webp' },
      { judul: 'Padamkan Api', desc: 'Gunakan APAR atau alat pemadam lain. Arahkan ke sumber api dari posisi aman.', gambar: '/images/kebakaran/langkah-3-padamkan-api.webp' },
      { judul: 'Evakuasi Kru', desc: 'Jika api tidak dapat dipadamkan, segera evakuasi semua kru ke tempat aman.', gambar: '/images/kebakaran/langkah-4-evakuasi-kru.webp' },
      { judul: 'Hubungi Bantuan', desc: 'Segera hubungi pihak terkait untuk meminta bantuan (BASARNAS/Polairud).', gambar: '/images/kebakaran/langkah-5-hubungi-bantuan.webp' },
      { judul: 'Jauhi Sumber Bahaya', desc: 'Jauhkan diri dari area kebakaran dan pastikan semua kru selamat.', gambar: '/images/kebakaran/langkah-6-jauhi-bahaya.webp' },
    ],
    tandaGejala: [
      'Asap tebal dan bau terbakar',
      'Suhu di sekitar area meningkat',
      'Api terlihat di dek, mesin, atau kabin',
      'Material mulai meleleh dan terbakar',
    ],
  },
  {
    id: 'henti-napas',
    judul: 'Henti Napas / Jantung',
    desc: 'Resusitasi jantung paru (RJP) untuk korban tidak bernapas',
    icon: Activity,
    color: 'from-red-500 to-rose-600',
    darurat: true,
    langkah: [
      { judul: 'Pastikan tempat aman & datar', desc: 'Baringkan korban telentang di permukaan keras.', gambar: '/images/henti-napas/langkah-1-tempat-aman-datar.webp' },
      { judul: 'Periksa respons', desc: 'Panggil & guncang bahu korban. Jika tidak responsif, lanjutkan.', gambar: '/images/henti-napas/langkah-2-periksa-respons.webp' },
      { judul: 'Kompresi dada 30x', desc: `Telapak tangan di tengah dada, lengan lurus.\nTekan 100-120x/menit, kedalaman 5 cm.`, gambar: '/images/henti-napas/langkah-3-kompresi-dada.webp' },
      { judul: 'Buka jalan napas', desc: `Angkat dagu & dorong dahi ke belakang.\nPeriksa mulut, bersihkan jika ada sumbat.`, gambar: '/images/henti-napas/langkah-4-buka-jalan-napas.webp' },
      { judul: 'Beri 2 hembusan napas', desc: `Jepit hidung, tutup mulut korban dengan mulut Anda.\nTiup 1 detik per hembusan.`, gambar: '/images/henti-napas/langkah-5-beri-hembusan-napas.webp' },
      { judul: 'Ulangi 30:2', desc: `Lanjutkan 30 kompresi : 2 hembusan\nhingga korban bernapas atau bantuan tiba.`, gambar: '/images/henti-napas/langkah-6-ulangi-rjp.webp' },
    ],
    catatan: 'Jika tidak terlatih, lakukan kompresi dada saja (hands-only CPR).',
  },
  {
    id: 'perdarahan',
    judul: 'Perdarahan Berat',
    desc: 'Menghentikan pendarahan dari luka terbuka',
    icon: Droplets,
    color: 'from-rose-500 to-red-600',
    darurat: true,
    langkah: [
      { judul: 'Tekan luka dengan kain bersih', desc: `Gunakan kasa steril atau kain bersih.\nTekan kuat langsung di atas luka.`, gambar: '/images/perdarahan/langkah-1-tekan-luka.webp' },
      { judul: 'Pertahankan tekanan', desc: `Jangan lepas kain pertama jika darah meresap;\ntambahkan lapisan di atasnya.`, gambar: '/images/perdarahan/langkah-2-pertahankan-tekanan.webp' },
      { judul: 'Angkat bagian yang berdarah', desc: 'Naikkan area luka di atas jantung jika memungkinkan.', gambar: '/images/perdarahan/langkah-3-angkat-bagian.webp' },
      { judul: 'Ikat perban tekan', desc: 'Ikat dengan kuat tapi tidak sampai memutus aliran darah.', gambar: '/images/perdarahan/langkah-4-ikat-perban.webp' },
      { judul: 'Panggil bantuan medis', desc: `Jika darah tidak berhenti setelah 10 menit\natau luka sangat dalam, segera ke dokter.`, gambar: '/images/perdarahan/langkah-5-panggil-bantuan.webp' },
    ],
  },
  {
    id: 'luka-bakar',
    judul: 'Luka Bakar',
    desc: 'Penanganan luka bakar di kapal (api, uap, cairan panas)',
    icon: Flame,
    color: 'from-orange-500 to-red-600',
    langkah: [
      { judul: 'Hentikan sumber panas', desc: 'Jauhkan korban dari sumber api/uap. Matikan sumber jika aman.', gambar: '/images/luka-bakar/langkah-1-hentikan-sumber-panas.webp' },
      { judul: 'Dinginkan dengan air mengalir', desc: `Alirkan air bersih (tidak es)\nselama 15-20 menit ke area luka.`, gambar: '/images/luka-bakar/langkah-2-dinginkan-air-mengalir.webp' },
      { judul: 'Lepas pakaian yang menempel', desc: 'Hindari kulit yang melepuh. Jangan tarik paksa.', gambar: '/images/luka-bakar/langkah-3-lepas-pakaian-menempel.webp' },
      { judul: 'Tutup dengan kain bersih', desc: `Gunakan kasa steril atau kain bersih,\njangan oleskan pasta gigi/minyak.`, gambar: '/images/luka-bakar/langkah-4-tutup-kain-bersih.webp' },
      { judul: 'Bawa ke fasilitas medis', desc: `Untuk luka bakar luas atau dalam,\nsegera cari bantuan medis.`, gambar: '/images/luka-bakar/langkah-5-bawa-fasilitas-medis.webp' },
    ],
    catatan: 'Jangan pecahkan lepuhan. Jangan oleskan mentega, pasta gigi, atau kecap.',
  },
  {
    id: 'patah-tulang',
    judul: 'Patah Tulang / Fraktur',
    desc: 'Menggerakkan atau memindahkan korban yang diduga patah tulang',
    icon: Bone,
    color: 'from-amber-500 to-orange-600',
    langkah: [
      { judul: 'Jangan gerakkan area yang patah', desc: ' Pasang bidai atau bahan kaku di sekitar tulang untuk menahan tulang tetap pada posisinya.', gambar: '/images/patah-tulang/langkah-1-jangan-gerakkan.webp' },
      { judul: 'Ikat bidai di atas & bawah luka', desc: `Ikat dua titik di luar area bengkak,\njangan terlalu ketat.`, gambar: '/images/patah-tulang/langkah-2-ikat-bidai.webp' },
      { judul: 'Kompres dingin', desc: 'Bungkus es dengan kain, tempel di area bengkak 15 menit.', gambar: '/images/patah-tulang/langkah-3-kompres-dingin.webp' },
      { judul: 'Posisikan nyaman', desc: 'Angkat area cedera di atas jantung jika memungkinkan.', gambar: '/images/patah-tulang/langkah-4-posisikan-nyaman.webp' },
      { judul: 'Evakuasi ke medis', desc: `Jangan mencoba meluruskan tulang.\nBawa ke rumah sakit segera.`, gambar: '/images/patah-tulang/langkah-5-evakuasi-medis.webp' },
    ],
  },
  {
    id: 'hipotermia',
    judul: 'Hipotermia',
    desc: 'Korban kedinginan berat karena terlalu lama di air',
    icon: Wind,
    color: 'from-cyan-500 to-blue-600',
    langkah: [
      { judul: 'Bawa ke tempat hangat', desc: 'Pindahkan korban dari air/angin ke ruangan terlindung.', gambar: '/images/hipotermia/langkah-1-bawa-tempat-hangat.webp' },
      { judul: 'Ganti pakaian basah', desc: 'Lepaskan pakaian basah perlahan, ganti dengan kering.', gambar: '/images/hipotermia/langkah-2-ganti-pakaian-basah.webp' },
      { judul: 'Selimutkan tubuh', desc: 'Gunakan selimut atau jaket. Fokus pada kepala, leher, dada.', gambar: '/images/hipotermia/langkah-3-selimutkan-tubuh.webp' },
      { judul: 'Beri minuman hangat manis', desc: `Jika korban sadar & bisa menelan.\nJangan beri alkohol.`, gambar: '/images/hipotermia/langkah-4-minuman-hangat-manis.webp' },
      { judul: 'Panggil bantuan medis', desc: 'Hipotermia berat butuh penanganan medis segera.', gambar: '/images/hipotermia/langkah-5-panggil-bantuan-medis.webp' },
    ],
    catatan: 'Jangan menggosok tubuh korban. Jangan rendam air panas — perubahan suhu drastis berbahaya.',
  },
  {
    id: 'sengatan-matahari',
    judul: 'Sengatan Matahari / Heatstroke',
    desc: 'Korban kepanasan akibat terlalu lama terpapar matahari',
    icon: Sun,
    color: 'from-amber-500 to-yellow-600',
    langkah: [
      { judul: 'Pindahkan ke tempat teduh', desc: 'Bawa ke area terlindung dari sinar matahari langsung.', gambar: '/images/sengatan-matahari/langkah-1-pindahkan-tempat-teduh.webp' },
      { judul: 'Longgarkan pakaian', desc: 'Buka kerah, sabuk, pakaian ketat untuk membantu pendinginan.', gambar: '/images/sengatan-matahari/langkah-2-longgarkan-pakaian.webp' },
      { judul: 'Kompres dingin', desc: 'Tempelkan kain basah di dahi, leher, ketiak, selangkangan.', gambar: '/images/sengatan-matahari/langkah-3-kompres-dingin.webp' },
      { judul: 'Beri minum air', desc: `Jika sadar, beri air sedikit demi sedikit.\nTambahkan garam/gula jika ada.`, gambar: '/images/sengatan-matahari/langkah-4-beri-minum-air.webp' },
      { judul: 'Evakuasi jika tidak sadar', desc: `Heatstroke berat dapat fatal.\nSegera cari bantuan medis.`, gambar: '/images/sengatan-matahari/langkah-5-evakuasi-tidak-sadar.webp' },
    ],
  },
  {
    id: 'gigitan',
    judul: 'Gigitan / Sengatan Hewan Laut',
    desc: 'Penanganan gigitan ikan, ubur-ubur, atau sengatan',
    icon: Bug,
    color: 'from-violet-500 to-purple-600',
    langkah: [
      { judul: 'Jauhkan dari sumber', desc: 'Keluarkan korban dari area berbahaya.', gambar: '/images/gigitan/langkah-1-jauhkan-dari-sumber.webp' },
      { judul: 'Cuci luka dengan air laut', desc: `Untuk sengatan ubur-ubur,\nbilas dengan cuka jika tersedia.`, gambar: '/images/gigitan/langkah-2-cuci-luka-air-laut.webp' },
      { judul: 'Angkat sengat dengan pinset', desc: `Jangan digaruk.\nBuang sisa tentakel dengan hati-hati.`, gambar: '/images/gigitan/langkah-3-angkat-sengat-pinset.webp' },
      { judul: 'Kompres dengan air panas', desc: `Rendam area sengatan di air panas 40-45°C\nselama 20 menit.`, gambar: '/images/gigitan/langkah-4-kompres-air-panas.webp' },
      { judul: 'Bawa ke medis', desc: `Jika sesak napas, bengkak meluas, atau reaksi alergi —\nsegera ke dokter.`, gambar: '/images/gigitan/langkah-5-bawa-ke-medis.webp' },
    ],
  },
];

export default function PertolonganPertama() {
  const [openId, setOpenId] = useState<string | null>('tenggelam');

  return (
    <div className="bg-ink-50/40 min-h-screen">
      <div className="container-app py-8">
      {/* ── Hero Section ── */}
      <section className="relative mb-8 flex overflow-hidden rounded-2xl shadow-xl" style={{ minHeight: '410px', background: 'linear-gradient(135deg, #102470 0%, #1a3a8f 50%, #1e4faa 100%)' }}>
        {/* Subtle dot texture overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Left: content */}
        <div className="relative z-10 flex w-full flex-col justify-center px-10 py-10 sm:w-[52%] sm:px-14">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-200 backdrop-blur-sm">
            <Heart className="h-3.5 w-3.5 text-blue-300" />
            Panduan Darurat
          </div>
          <h1 className="mb-4 text-3xl font-black uppercase leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pertolongan<br />Pertama
          </h1>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-blue-100/80 sm:text-base">
            Informasi dan panduan pertolongan pertama untuk nelayan dalam kondisi darurat di laut.
          </p>
          <div className="flex w-fit items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-300/40 bg-blue-400/20">
              <Activity className="h-3.5 w-3.5 text-blue-200" />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-bold text-white">Ingat!</p>
              <p className="text-xs text-blue-100/80">
                Pertolongan pertama yang cepat dan tepat dapat menyelamatkan nyawa.
              </p>
            </div>
          </div>
        </div>

        {/* Hero image with left-side readability overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/WhatsApp_Image_2026-07-23_at_19.40.04 copy.jpeg"
            alt="Pertolongan pertama di atas kapal"
            className="h-full w-full object-cover object-[58%_center]"
            style={{ minHeight: '410px' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102470]/70 via-[#102470]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#102470]/40 to-transparent" />
        </div>

        {/* Mobile: overlay for readability */}
        <div className="absolute inset-0 z-[2] sm:hidden">
          <div className="absolute inset-0 bg-[#102470]/70" />
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

        {/* Emergency banner */}
        <div className="mb-8 flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-100">Dalam keadaan darurat, hubungi:</p>
              <p className="text-xl font-extrabold">115 (BASARNAS) · 119 (Ambulans) · 110 (Polairud)</p>
            </div>
          </div>
          <a href="tel:115" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-md transition hover:scale-105">
            <Phone className="h-4 w-4" /> Panggil 115
          </a>
        </div>

        {/* Items accordion */}
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            const open = openId === item.id;
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                <button
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-ink-50/50"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-ink-900">{item.judul}</h3>
                      {item.darurat && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">Darurat</span>
                      )}
                    </div>
                    <p className={`text-xs text-ink-500 ${(item.id === 'kapal-bocor' || item.id === 'kebakaran') ? 'max-w-[28rem] leading-relaxed' : ''}`}>{item.desc}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <div className="border-t border-ink-100 bg-ink-50/30 p-5 animate-fade-in">
                    <ol className="space-y-4">
                      {item.langkah.map((step, i) => (
                        step.gambar ? (
                          <li key={i} className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row">
                              {/* teks */}
                              <div className="flex min-w-0 flex-1 gap-3 p-4">
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-xs font-bold text-white shadow`}>
                                  {i + 1}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-ink-900">{step.judul}</p>
                                  <p className="mt-1 text-sm leading-relaxed text-ink-600 break-words whitespace-pre-line">{step.desc}</p>
                                </div>
                              </div>
                              {/* gambar */}
                              <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44">
                                <img
                                  src={step.gambar}
                                  alt={step.judul}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>
                          </li>
                        ) : step.card ? (
                          <li key={i} className="rounded-xl border border-ink-100 bg-white shadow-sm">
                            <div className="flex min-w-0 flex-1 gap-3 p-4">
                              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-xs font-bold text-white shadow`}>
                                {i + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-ink-900">{step.judul}</p>
                                <p className="mt-1 text-sm leading-relaxed text-ink-600 break-words whitespace-pre-line">{step.desc}</p>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <li key={i} className="flex gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                              {i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-ink-900">{step.judul}</p>
                              <p className="mt-1 text-sm leading-relaxed text-ink-600 break-words whitespace-pre-line">{step.desc}</p>
                            </div>
                          </li>
                        )
                      ))}
                    </ol>
                    {item.tandaGejala && (
                      <div className="mt-5 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                        <div className="mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                          <p className="text-sm font-bold text-ink-900">Tanda dan Gejala</p>
                        </div>
                        <ul className="space-y-1.5">
                          {item.tandaGejala.map((tanda, i) => (
                            <li key={i} className="flex gap-2 text-xs text-ink-900">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-900" />
                              <span className="leading-relaxed">{tanda}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.catatan && (
                      <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-amber-800 ring-1 ring-amber-200">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <p className="text-xs">{item.catatan}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-ink-100/60 p-5 text-ink-700">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
          <p className="text-sm">
            Panduan ini adalah pertolongan pertama dasar dan tidak menggantikan penanganan medis profesional. Selalu utamakan evakuasi ke fasilitas kesehatan terdekat. Disarankan mengikuti pelatihan P3K resmi dari PMI atau BASARNAS.
          </p>
        </div>
      </div>
    </div>
  );
}
