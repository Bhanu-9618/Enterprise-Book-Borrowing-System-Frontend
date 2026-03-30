import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      token: null,
      role: null,
      id: null,
      name: null,
      setAuth: (data) => set({ ...data }),
      clearAuth: () => set({ token: null, role: null, id: null, name: null }),
    }),
    { name: 'auth-storage' }
  )
);