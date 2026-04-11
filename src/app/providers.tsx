'use client';

import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import dynamic from 'next/dynamic';
import { queryClient } from '@/lib/api/queryClient';
import { Layout } from '@/components/layout/Layout';
import { ToastContainer } from '@/components/ui/Toast';
import { GlobalLoading } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toast';

const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((module) => module.ReactQueryDevtools),
  { ssr: false }
);

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { toasts, removeToast } = useToastStore();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            // Use system fonts instead of loading external fonts
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          // Disable CSS variable injection to reduce CSS
          cssVar: false,
        }}
        // Prevent Ant Design from loading external fonts
        prefixCls="ant"
      >
        <Layout>
          {children}
        </Layout>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <GlobalLoading />
        {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </ConfigProvider>
    </QueryClientProvider>
  );
}

