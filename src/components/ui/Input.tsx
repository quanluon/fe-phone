import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50';
    
    const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
    const iconClasses = leftIcon ? 'pl-10' : '';
    const rightIconClasses = rightIcon ? 'pr-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div 
              className={cn(
                'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
                onLeftIconClick && 'cursor-pointer hover:text-gray-600'
              )}
              onClick={onLeftIconClick}
            >
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              baseClasses,
              errorClasses,
              iconClasses,
              rightIconClasses,
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div 
              className={cn(
                'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400',
                onRightIconClick && 'cursor-pointer hover:text-gray-600'
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

