/*
# Video Edukasi & Checklist Keselamatan CMS Schema

## Tables Created:
1. `videos` - Video edukasi keselamatan melaut
2. `checklist_categories` - Kategori checklist keselamatan
3. `checklist_items` - Item perlengkapan/pemeriksaan checklist
*/

-- 1. TABEL VIDEOS
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text NOT NULL,
  youtube_id text NOT NULL,
  durasi text DEFAULT '0:00',
  kategori text NOT NULL DEFAULT 'Perlengkapan',
  urutan int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publik_select_videos" ON videos;
CREATE POLICY "publik_select_videos" ON videos FOR SELECT
  TO anon, authenticated USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all_videos" ON videos;
CREATE POLICY "admin_all_videos" ON videos FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Seed Data Videos
INSERT INTO videos (judul, deskripsi, youtube_id, durasi, kategori, urutan, is_active)
VALUES
  ('Pentingnya Alat Keselamatan dan APAR di Kapal Perikanan | Edukasi Keselamatan PPN Kejawanan Cirebon', 'Video edukasi tentang pentingnya alat keselamatan dan APAR di kapal perikanan oleh PPN Kejawanan Cirebon.', 'EVvvOthZc28', '12:10', 'Perlengkapan', 1, true),
  ('Sinyal Darurat di Laut: Cara Memanggil Bantuan', 'Pelajari sinyal darurat dan cara menggunakan radio komunikasi VHF channel 16.', '1oOi73pmHQg', '2:48', 'Komunikasi', 2, true),
  ('Pertolongan Pertama: RJP untuk Nelayan', 'Langkah-langkah resusitasi jantung paru untuk korban tenggelam.', 'cnJoPlHxFqM', '7:15', 'P3K', 3, true),
  ('Navigasi Sederhana dengan Kompas & GPS', 'Dasar-dasar navigasi laut menggunakan kompas dan GPS untuk nelayan.', '3f3Vf_tNFXc', '11:42', 'Navigasi', 4, true),
  ('Kelengkapan Dokumen dan Prosedur Penerbitan Surat Persetujuan Berlayar (SPB)', 'Panduan singkat kelengkapan dokumen dan prosedur penerbitan Surat Persetujuan Berlayar (SPB) bagi nelayan.', 'EHfMUkVctbU', '2:59', 'Dokumen', 5, true)
ON CONFLICT DO NOTHING;


-- 2. TABEL CHECKLIST CATEGORIES
CREATE TABLE IF NOT EXISTS checklist_categories (
  id text PRIMARY KEY,
  title text NOT NULL,
  desc_text text,
  icon text DEFAULT 'LifeBuoy',
  color text DEFAULT 'from-red-500 to-rose-600',
  urutan int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checklist_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publik_select_checklist_cat" ON checklist_categories;
CREATE POLICY "publik_select_checklist_cat" ON checklist_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_all_checklist_cat" ON checklist_categories;
CREATE POLICY "admin_all_checklist_cat" ON checklist_categories FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Seed Data Checklist Categories
INSERT INTO checklist_categories (id, title, desc_text, icon, color, urutan)
VALUES
  ('perlengkapan', 'Perlengkapan Keselamatan', 'Wajib dibawa dan dipakai oleh setiap awak kapal', 'LifeBuoy', 'from-red-500 to-rose-600', 1),
  ('navigasi', 'Alat Navigasi & Komunikasi', 'Memastikan kapal tetap terhubung & tepat arah', 'Compass', 'from-sky-500 to-blue-600', 2),
  ('kapal', 'Kondisi Kapal', 'Pemeriksaan teknis sebelum berlayar', 'Ship', 'from-emerald-500 to-green-600', 3),
  ('pribadi', 'Kesiapan Pribadi Awak', 'Kondisi kesehatan & logistik awak kapal', 'Heart', 'from-amber-500 to-orange-600', 4)
ON CONFLICT (id) DO NOTHING;


-- 3. TABEL CHECKLIST ITEMS
CREATE TABLE IF NOT EXISTS checklist_items (
  id text PRIMARY KEY,
  category_id text REFERENCES checklist_categories(id) ON DELETE CASCADE,
  label text NOT NULL,
  desc_text text NOT NULL,
  icon text DEFAULT 'LifeBuoy',
  icon_color text DEFAULT 'text-orange-500',
  urutan int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publik_select_checklist_items" ON checklist_items;
CREATE POLICY "publik_select_checklist_items" ON checklist_items FOR SELECT
  TO anon, authenticated USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_all_checklist_items" ON checklist_items;
CREATE POLICY "admin_all_checklist_items" ON checklist_items FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Seed Data Checklist Items
INSERT INTO checklist_items (id, category_id, label, desc_text, icon, icon_color, urutan, is_active)
VALUES
  ('jaket', 'perlengkapan', 'Jaket Pelampung', 'Wajib tersedia 100% sesuai jumlah awak kapal dan sesuai standar SNI', 'Shirt', 'text-orange-500', 1, true),
  ('apel', 'perlengkapan', 'APAR (Alat Pemadam Api Ringan)', 'Dalam masa berlaku, diletakkan mudah dijangkau', 'FireExtinguisher', 'text-red-500', 2, true),
  ('pelampung', 'perlengkapan', 'Pelampung Darurat', 'Wajib, 50% jumlah awak kapal, tali apung 30 meter', 'LifeBuoy', 'text-orange-500', 3, true),
  ('selimut', 'perlengkapan', 'Selimut Pemadam Kebakaran', '4 karung goni', 'Flame', 'text-red-500', 4, true),
  ('lampu', 'perlengkapan', 'Lampu Senter / Lampu Darurat', 'Baterai penuh, untuk sinyal darurat', 'Flashlight', 'text-amber-500', 5, true),
  
  ('gps', 'navigasi', 'GPS / Kompas', 'Minimal 1 unit, berfungsi dengan baik', 'Compass', 'text-red-500', 1, true),
  ('radio', 'navigasi', 'Radio Komunikasi (VHF/HF)', 'Wajib 1 unit, frekuensi tersetel, siap komunikasi darurat', 'Radio', 'text-blue-700', 2, true),
  ('hp', 'navigasi', 'HP + Powerbank Penuh', 'Pulsa cukup, sinyal darurat 112 aktif', 'Smartphone', 'text-blue-600', 3, true),
  ('peta', 'navigasi', 'Peta Laut / Chart', 'Sesuai dengan daerah operasional penangkapan ikan', 'Map', 'text-emerald-600', 4, true),
  
  ('mesin', 'kapal', 'Mesin & Bahan Bakar', 'Mesin normal, bahan bakar lebih dari cukup', 'Fuel', 'text-orange-600', 1, true),
  ('lambung', 'kapal', 'Lambung Kapal', 'Tidak ada kebocoran, katup tertutup rapat', 'Ship', 'text-blue-800', 2, true),
  ('pompa', 'kapal', 'Pompa Bilga', 'Berfungsi baik untuk menyedot air', 'Droplets', 'text-blue-500', 3, true),
  ('lampu-nav', 'kapal', 'Lampu Navigasi', 'Lampu merah-hijau-putih menyala', 'Lightbulb', 'text-amber-500', 4, true),
  
  ('kesehatan', 'pribadi', 'Kondisi Kesehatan Prima', 'Tidak ada yang sakit, cukup istirahat', 'Heart', 'text-red-500', 1, true),
  ('makan', 'pribadi', 'Logistik Makan & Minum', 'Cukup untuk durasi melaut + cadangan', 'Utensils', 'text-amber-600', 2, true),
  ('p3k', 'pribadi', 'Kotak P3K', 'Lengkap & tidak kadaluarsa', 'Cross', 'text-red-500', 3, true),
  ('keluarga', 'pribadi', 'Kabari Keluarga', 'Beri tahu rencana & estimasi kembali', 'Phone', 'text-emerald-600', 4, true)
ON CONFLICT (id) DO NOTHING;
