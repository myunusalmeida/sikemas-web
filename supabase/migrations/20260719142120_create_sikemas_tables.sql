/*
# SIKEMAS Database Schema

## Tables Created:
1. `berita` - Berita/pengumuman dari petugas pelabuhan
   - id, judul, ringkasan, konten, gambar_url, status (draft/publish), created_at, updated_at
2. `nomor_darurat` - Kontak darurat untuk nelayan
   - id, nama_instansi, nomor_telp, kategori, ikon, urutan
3. `page_views` - Tracking kunjungan halaman (sederhana)
   - id, halaman, visited_at

## Security:
- `berita`: publik SELECT hanya status='publish'; admin full CRUD
- `nomor_darurat`: publik SELECT; admin full CRUD
- `page_views`: anon INSERT; admin SELECT
*/

-- Tabel Berita
CREATE TABLE IF NOT EXISTS berita (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  ringkasan text,
  konten text NOT NULL,
  gambar_url text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE berita ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publik_select_berita" ON berita;
CREATE POLICY "publik_select_berita" ON berita FOR SELECT
  TO anon, authenticated
  USING (status = 'publish' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_insert_berita" ON berita;
CREATE POLICY "admin_insert_berita" ON berita FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_berita" ON berita;
CREATE POLICY "admin_update_berita" ON berita FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_berita" ON berita;
CREATE POLICY "admin_delete_berita" ON berita FOR DELETE
  TO authenticated USING (true);

-- Tabel Nomor Darurat
CREATE TABLE IF NOT EXISTS nomor_darurat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_instansi text NOT NULL,
  nomor_telp text NOT NULL,
  kategori text DEFAULT 'lainnya',
  ikon text,
  urutan int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nomor_darurat ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publik_select_nomor" ON nomor_darurat;
CREATE POLICY "publik_select_nomor" ON nomor_darurat FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_nomor" ON nomor_darurat;
CREATE POLICY "admin_insert_nomor" ON nomor_darurat FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_nomor" ON nomor_darurat;
CREATE POLICY "admin_update_nomor" ON nomor_darurat FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_nomor" ON nomor_darurat;
CREATE POLICY "admin_delete_nomor" ON nomor_darurat FOR DELETE
  TO authenticated USING (true);

-- Tabel Page Views
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  halaman text NOT NULL,
  visited_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_pageviews" ON page_views;
CREATE POLICY "anon_insert_pageviews" ON page_views FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_pageviews" ON page_views;
CREATE POLICY "admin_select_pageviews" ON page_views FOR SELECT
  TO authenticated USING (true);

-- Seed data nomor darurat
INSERT INTO nomor_darurat (nama_instansi, nomor_telp, kategori, ikon, urutan) VALUES
  ('BASARNAS', '115', 'basarnas', 'anchor', 1),
  ('Syahbandar Perikanan Kuala Tari', '0812-3456-7890', 'syahbandar', 'ship', 2),
  ('Polairud', '110', 'kepolisian', 'shield', 3),
  ('BMKG Marine', '196', 'bmkg', 'cloud', 4),
  ('Ambulans / Gawat Darurat', '119', 'ambulans', 'heart', 5),
  ('PP Kuala Tari', '0653-XXXXXXX', 'pelabuhan', 'anchor', 6)
ON CONFLICT DO NOTHING;

-- Seed data berita
INSERT INTO berita (judul, ringkasan, konten, gambar_url, status) VALUES
  (
    'Sosialisasi Keselamatan Melaut di PP Kuala Tari',
    'Kegiatan sosialisasi keselamatan melaut bagi nelayan untuk meningkatkan kesadaran akan pentingnya keselamatan.',
    'Pelabuhan Perikanan Kuala Tari mengadakan kegiatan sosialisasi keselamatan melaut yang dihadiri oleh ratusan nelayan. Kegiatan ini bertujuan untuk meningkatkan kesadaran nelayan tentang pentingnya menggunakan alat keselamatan saat melaut. Materi yang disampaikan meliputi penggunaan jaket pelampung, alat komunikasi, dan prosedur darurat di laut. Petugas dari BASARNAS turut hadir memberikan pelatihan pertolongan pertama dan cara memanggil bantuan saat terjadi kedaruratan di laut.',
    'https://images.pexels.com/photos/6168/man-person-couple-people.jpg',
    'publish'
  ),
  (
    'Waspada Gelombang Tinggi di Perairan Barat Aceh',
    'BMKG mengeluarkan peringatan dini gelombang tinggi di perairan barat Aceh selama 3 hari ke depan.',
    'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) mengeluarkan peringatan dini terkait potensi gelombang tinggi di perairan barat Aceh. Gelombang diperkirakan mencapai 2,5 hingga 4 meter selama 3 hari ke depan. Nelayan dihimbau untuk tidak melaut sementara waktu hingga kondisi cuaca membaik. Pantau terus informasi cuaca terkini melalui aplikasi BMKG atau hubungi Syahbandar Pelabuhan untuk informasi lebih lanjut.',
    'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg',
    'publish'
  ),
  (
    'Pemeriksaan Kapal dan Alat Keselamatan',
    'Pemeriksaan rutin kapal dan alat keselamatan untuk memastikan kelayakan sebelum melaut.',
    'Tim petugas Pelabuhan Perikanan Kuala Tari melaksanakan pemeriksaan rutin terhadap kapal-kapal nelayan yang akan melaut. Pemeriksaan meliputi kondisi lambung kapal, mesin, alat navigasi, alat komunikasi, dan perlengkapan keselamatan seperti jaket pelampung dan APAR. Kapal yang tidak memenuhi standar keselamatan tidak diizinkan untuk berlayar hingga perbaikan selesai dilakukan. Nelayan diharapkan untuk selalu mempersiapkan kapalnya sebelum melaut demi keselamatan bersama.',
    'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg',
    'publish'
  )
ON CONFLICT DO NOTHING;
