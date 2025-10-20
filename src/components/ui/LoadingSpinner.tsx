"use client";

import React from 'react';

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color of the spinner */
  color?: 'primary' | 'white' | 'gray' | 'current';
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-600',
  current: 'border-current',
};

/**
 * LoadingSpinner component for displaying loading states
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingOverlayProps {
  /** Show the overlay */
  show: boolean;
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background opacity (0-100) */
  opacity?: number;
  /** Message to display below spinner */
  message?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingOverlay component for full-screen or container loading states
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  size = 'lg',
  opacity = 75,
  message,
  className = '',
}) => {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-50 ${className}`}
      style={{ backgroundColor: `rgba(255, 255, 255, ${opacity / 100})` }}
    >
      <LoadingSpinner size={size} color="primary" />
      {message && (
        <p className="mt-3 text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

interface LoadingButtonProps {
  /** Whether the button is in loading state */
  loading: boolean;
  /** Size of the spinner */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingButton component for button loading states
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  size = 'sm',
  className = '',
}) => {
  if (!loading) return null;

  return (
    <LoadingSpinner
      size={size}
      color="current"
      className={className}
    />
  );
};


