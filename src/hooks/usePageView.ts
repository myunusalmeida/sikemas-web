import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function usePageView() {
  const location = useLocation();
  useEffect(() => {
    const halaman = location.pathname === '/' ? 'beranda' : location.pathname.replace('/', '');
    supabase.from('page_views').insert({ halaman }).then(() => {});
  }, [location.pathname]);
}
