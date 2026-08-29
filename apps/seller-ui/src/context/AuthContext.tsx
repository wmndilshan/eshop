'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Seller, getLoggedInSeller, logoutSeller } from '../lib/api/seller-auth';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface AuthContextValue {
  seller: Seller | null;
  loading: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  seller: null,
  loading: true,
  refetch: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchSeller = async () => {
    try {
      const res = await getLoggedInSeller();
      setSeller(res.data.seller);
    } catch {
      setSeller(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSeller(); }, []);

  const logout = async () => {
    try {
      await logoutSeller();
    } catch {}
    setSeller(null);
    queryClient.clear();
    toast.success('Logged out');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ seller, loading, refetch: fetchSeller, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
