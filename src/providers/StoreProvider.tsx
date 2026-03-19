"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (initialized) {
      return;
    }

    initializeAuth();
  }, [initializeAuth, initialized]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
