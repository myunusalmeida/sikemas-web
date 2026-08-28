import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Beranda from './pages/Beranda';
import InfoCuaca from './pages/InfoCuaca';
import Checklist from './pages/Checklist';
import PertolonganPertama from './pages/PertolonganPertama';
import NomorDarurat from './pages/NomorDarurat';
import VideoEdukasi from './pages/VideoEdukasi';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail';
import Tentang from './pages/Tentang';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBerita from './pages/admin/AdminBerita';
import AdminBeritaForm from './pages/admin/AdminBeritaForm';
import AdminNomorDarurat from './pages/admin/AdminNomorDarurat';
import AdminNomorForm from './pages/admin/AdminNomorForm';
import AdminHero from './pages/admin/AdminHero';
import AdminHeroForm from './pages/admin/AdminHeroForm';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/cuaca" element={<InfoCuaca />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/pertolongan-pertama" element={<PertolonganPertama />} />
            <Route path="/nomor-darurat" element={<NomorDarurat />} />
            <Route path="/video" element={<VideoEdukasi />} />
            <Route path="/berita" element={<Berita />} />
            <Route path="/berita/:id" element={<BeritaDetail />} />
            <Route path="/tentang" element={<Tentang />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="hero/new" element={<AdminHeroForm />} />
            <Route path="hero/:id/edit" element={<AdminHeroForm />} />
            <Route path="berita" element={<AdminBerita />} />
            <Route path="berita/new" element={<AdminBeritaForm />} />
            <Route path="berita/:id/edit" element={<AdminBeritaForm />} />
            <Route path="nomor-darurat" element={<AdminNomorDarurat />} />
            <Route path="nomor-darurat/new" element={<AdminNomorForm />} />
            <Route path="nomor-darurat/:id/edit" element={<AdminNomorForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
