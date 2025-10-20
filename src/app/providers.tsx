'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import { queryClient } from '@/lib/api/queryClient';
import { Layout } from '@/components/layout/Layout';
import { ToastContainer } from '@/components/ui/Toast';
import { GlobalLoading } from '@/components/ui';
import { useToastStore } from '@/stores/toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { toasts, removeToast } = useToastStore();
  
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
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}



