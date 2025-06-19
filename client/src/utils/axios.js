import axios from 'axios';
import { supabase } from './../components/auth/supabaseClient'; // import your supabase client

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

async function getSupabaseAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('[axios] Supabase session fetch error:', error.message);
    return null;
  }

  const token = data?.session?.access_token;
  if (token) {
    console.log('[axios] Using Supabase access token');
    return token;
  }

  return null;
}

instance.interceptors.request.use(
  async (config) => {
    let token = await getSupabaseAccessToken();

    // fallback to custom email/password token
    if (!token) {
      token = localStorage.getItem('token');
      if (token) {
        console.log('[axios] Using internal JWT token');
      } else {
        console.log('[axios] No token found');
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('[axios] Request error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[axios] 401 Unauthorized — clearing tokens and redirecting');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      console.error('[axios] Response error:', error);
    }
    return Promise.reject(error);
  }
);

export default instance;
