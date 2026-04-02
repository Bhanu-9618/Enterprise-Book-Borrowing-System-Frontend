import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
  id: number | null;
  name: string | null;
  setAuth: (data: { token: string; role: 'ADMIN' | 'USER'; id: number; name: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: (typeof window !== 'undefined' ? Cookies.get('token') : null) || null,
      role: (typeof window !== 'undefined' ? (Cookies.get('role') as 'ADMIN' | 'USER') : null) || null,
      id: null,
      name: null,
      setAuth: (data) => {
        // Sync to cookies for Middleware access
        Cookies.set('token', data.token, { expires: 7 }); // 7 days
        Cookies.set('role', data.role, { expires: 7 });
        set({ ...data });
      },
      clearAuth: () => {
        // Remove cookies
        Cookies.remove('token');
        Cookies.remove('role');
        set({ token: null, role: null, id: null, name: null });
        // Force fully clear localStorage as well
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    { name: 'auth-storage' }
  )
);