'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { XMarkIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CONTACT_INFO } from '@/lib/constants';
import { Button } from './Button';

interface CheckoutNotSupportedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutNotSupportedModal: React.FC<CheckoutNotSupportedModalProps> = ({
  isOpen,
  onClose
}) => {
  const t = useTranslations('cart');

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('checkout.notSupported.title')}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              {t('checkout.notSupported.message')}
            </p>
            <p className="text-sm text-gray-500">
              {t('checkout.notSupported.contactUs')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('checkout.contact.phone')}</p>
                <a 
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('checkout.contact.email')}</p>
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPinIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('checkout.contact.address')}</p>
                <p className="text-sm text-gray-600">{CONTACT_INFO.address}</p>
              </div>
            </div> */}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('checkout.contact.hours')}</p>
                <p className="text-sm text-gray-600">{CONTACT_INFO.hours}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {t('checkout.notSupported.close')}
            </Button>
            <Button
              onClick={() => window.open(`tel:${CONTACT_INFO.phone}`, '_self')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {t('checkout.notSupported.callNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
