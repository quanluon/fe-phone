'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/api/queryClient';
import { Layout } from '@/components/layout/Layout';
import { ToastContainer } from '@/components/ui/Toast';
import { useToastStore } from '@/stores/toast';
import { useTokenSync } from '@/hooks/useTokenSync';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { toasts, removeToast } = useToastStore();
  
  // Sync tokens from localStorage to cookies on page load
  useTokenSync();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {children}
      </Layout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}



