import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Berita = {
  id: string;
  judul: string;
  ringkasan: string | null;
  konten: string;
  gambar_url: string | null;
  status: 'draft' | 'publish';
  created_at: string;
  updated_at: string;
};

export type NomorDarurat = {
  id: string;
  nama_instansi: string;
  nomor_telp: string;
  kategori: string;
  ikon: string | null;
  urutan: number;
  created_at: string;
};

export type PageView = {
  id: string;
  halaman: string;
  visited_at: string;
};

export type HeroSlide = {
  id: string;
  judul: string | null;
  subjudul: string | null;
  gambar_url: string;
  alt_text: string | null;
  position: string | null;
  urutan: number;
  is_active: boolean;
  created_at: string;
};

export type VideoDb = {
  id: string;
  judul: string;
  deskripsi: string;
  youtube_id: string;
  durasi: string;
  kategori: string;
  urutan: number;
  is_active: boolean;
  created_at: string;
};

export type ChecklistCategoryDb = {
  id: string;
  title: string;
  desc_text: string | null;
  icon: string;
  color: string;
  urutan: number;
  created_at: string;
};

export type ChecklistItemDb = {
  id: string;
  category_id: string;
  label: string;
  desc_text: string;
  icon: string;
  icon_color: string;
  urutan: number;
  is_active: boolean;
  created_at: string;
};
