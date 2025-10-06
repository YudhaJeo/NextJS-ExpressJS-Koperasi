import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(
  (config) => {
    // Gunakan token dari cookie, bisa jadi namanya berbeda
    const token = Cookies.get('token') || Cookies.get('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Hapus semua token
      Cookies.remove('token');
      Cookies.remove('accessToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default instance;