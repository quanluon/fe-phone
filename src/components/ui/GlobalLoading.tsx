"use client";

import React, { useEffect } from 'react';
import { useLoadingStore } from '@/stores/loading';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * GlobalLoading component - displays a full-screen loading overlay
 * Controlled by the global loading store
 */
export const GlobalLoading: React.FC = () => {
  const { isLoading, message } = useLoadingStore();

  // Prevent body scroll when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm transition-opacity duration-200"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner size="xl" color="primary" />
      {message && (
        <p className="mt-4 text-base text-gray-700 font-medium animate-pulse">
          {message}
        </p>
      )}
      <p className="mt-2 text-sm text-gray-500">Please wait...</p>
    </div>
  );
};



