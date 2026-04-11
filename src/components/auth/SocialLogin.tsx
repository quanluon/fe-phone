'use client';

import { useSocialLogin } from '@/hooks/useAuth';
import { getEnabledFirebaseProviders } from '@/lib/firebase/client';
import { getErrorMessage } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { useToastStore } from '@/stores/toast';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { SocialLoginButton } from './SocialLoginButton';

interface SocialLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onSuccess,
  onError,
  className = '',
}) => {
  const t = useTranslations('auth.social');
  const { addToast } = useToastStore();
  const socialLoginMutation = useSocialLogin();
  const [loadingProvider, setLoadingProvider] = useState<'facebook' | 'google' | null>(null);
  const enabledProviders = getEnabledFirebaseProviders();

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    try {
      setLoadingProvider(provider);

      await socialLoginMutation.mutateAsync(provider);

      addToast({
        type: 'success',
        message: t('loginSuccess'),
      });
      onSuccess?.();
    } catch (error: unknown) {
      logger.error({ error, provider }, `${provider} login error`);
      const errorMessage = getErrorMessage(error, t('loginError'));

      addToast({
        type: 'error',
        message: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">{t('orContinueWith')}</span>
        </div>
      </div>

      <div className="space-y-3">
        {enabledProviders.map((provider) => (
          <SocialLoginButton
            key={provider}
            provider={provider}
            onClick={() => handleSocialLogin(provider)}
            loading={loadingProvider === provider}
            disabled={socialLoginMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};
