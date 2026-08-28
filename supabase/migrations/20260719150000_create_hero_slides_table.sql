/*
# Hero Slides CMS Schema

## Tables Created:
1. `hero_slides` - Gambar & banner hero untuk halaman beranda
   - id: uuid PRIMARY KEY
   - judul: text (opsional)
   - subjudul: text (opsional)
   - gambar_url: text NOT NULL (URL / base64 terkompresi)
   - alt_text: text
   - position: text (e.g. 'center', 'top', '60%')
   - urutan: int DEFAULT 0
   - is_active: boolean DEFAULT true
   - created_at: timestamptz DEFAULT now()

## Security:
- `hero_slides`: publik SELECT (jika is_active = true atau auth authenticated); admin full CRUD
*/

CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text,
  subjudul text,
  gambar_url text NOT NULL,
  alt_text text,
  position text DEFAULT 'center',
  urutan int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "publik_select_hero" ON hero_slides;
CREATE POLICY "publik_select_hero" ON hero_slides FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin_insert_hero" ON hero_slides;
CREATE POLICY "admin_insert_hero" ON hero_slides FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_hero" ON hero_slides;
CREATE POLICY "admin_update_hero" ON hero_slides FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_hero" ON hero_slides;
CREATE POLICY "admin_delete_hero" ON hero_slides FOR DELETE
  TO authenticated USING (true);

-- Data Awal (Seed Default Hero Slides)
INSERT INTO hero_slides (judul, subjudul, gambar_url, alt_text, position, urutan, is_active)
VALUES
  ('Selamat Datang di SIKEMAS', 'Sistem Informasi Keselamatan Maritim & Pelabuhan Kuala Tari', '/images/WhatsApp_Image_2026-07-22_at_15.16.04.jpeg', 'Kapal nelayan di laut', '60%', 1, true),
  ('Melaut Aman, Pulang Selamat', 'Informasi cuaca terpadu & nomor darurat untuk keselamatan nelayan', '/images/WhatsApp_Image_2026-08-23_at_13.09.02_(2).jpeg', 'Kapal nelayan warna tosca', 'center', 2, true),
  ('Layanan Terpadu Nelayan', 'Panduan P3K, checklist keselamatan, dan berita terkini', '/images/WhatsApp_Image_2026-08-23_at_13.09.02_(1).jpeg', 'Kapal nelayan putih-biru', 'center', 3, true)
ON CONFLICT DO NOTHING;
