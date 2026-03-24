import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
  id: string | null;
  setAuth: (data: { token: string; role: 'ADMIN' | 'USER'; id: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      id: null,
      setAuth: (data) => set({ ...data }),
      clearAuth: () => set({ token: null, role: null, id: null }),
    }),
    { name: 'auth-storage' }
  )
);