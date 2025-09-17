import { useSocialLogin } from '@/hooks/useAuth';
import { useToastStore } from '@/stores/toast';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { SocialLoginButton } from './SocialLoginButton';
import { ApiErrorResponse } from '@/types';

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
  const socialLoginMutation = useSocialLogin();
  const [loadingProvider, setLoadingProvider] = useState<'facebook' | 'google' | null>(null);
  const { addToast } = useToastStore();

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    try {
      setLoadingProvider(provider);
      
      // Initialize the social provider SDK
      let accessToken: string;
      let idToken: string | undefined;

      if (provider === 'google') {
        const result = await handleGoogleLogin();
        accessToken = result.accessToken;
        idToken = result.idToken;
      } else if (provider === 'facebook') {
        const result = await handleFacebookLogin();
        accessToken = result.accessToken;
      } else {
        throw new Error('Unsupported provider');
      }

      // Call the backend social login API
      await socialLoginMutation.mutateAsync({
        provider,
        accessToken,
        idToken,
      });

      addToast({
        type: 'success',
        message: t('loginSuccess'),
      });
      onSuccess?.();
    } catch (error: unknown) {
      console.error(`${provider} login error:`, error);
      const errorMessage = (error as ApiErrorResponse)?.response?.data?.message || t('loginError');
      addToast({
        type: 'error',
        message: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGoogleLogin = async (): Promise<{ accessToken: string; idToken: string }> => {
    return new Promise((resolve, reject) => {
      // Load Google Identity Services
      if (typeof window === 'undefined') {
        reject(new Error('Google login not available on server side'));
        return;
      }

      // Check if Google Identity Services is already loaded
      if (window.google?.accounts?.id) {
        initializeGoogleLogin(resolve, reject);
      } else {
        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeGoogleLogin(resolve, reject);
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google Identity Services'));
        };
        document.head.appendChild(script);
      }
    });
  };

  const initializeGoogleLogin = (
    resolve: (value: { accessToken: string; idToken: string }) => void,
    reject: (reason?: unknown) => void
  ) => {
    try {
      if (!window.google?.accounts?.id) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }
      
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: (response: { credential: string }) => {
          try {
            // Decode the JWT token to get user info
            resolve({
              accessToken: response.credential,
              idToken: response.credential,
            });
          } catch (error) {
            reject(new Error('Failed to decode Google token'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Trigger the Google login popup
      window.google.accounts.id.prompt((notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google login was cancelled or not displayed'));
        }
      });
    } catch (error) {
      reject(error);
    }
  };

  const handleFacebookLogin = async (): Promise<{ accessToken: string }> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Facebook login not available on server side'));
        return;
      }

      // Check if Facebook SDK is already loaded
      if (window.FB) {
        initializeFacebookLogin(resolve, reject);
      } else {
        // Load Facebook SDK
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.FB) {
            window.FB.init({
              appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
              cookie: true,
              xfbml: true,
              version: 'v18.0',
            });
            initializeFacebookLogin(resolve, reject);
          } else {
            reject(new Error('Facebook SDK failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load Facebook SDK'));
        };
        document.head.appendChild(script);
      }
    });
  };

  const initializeFacebookLogin = (
    resolve: (value: { accessToken: string }) => void,
    reject: (reason?: unknown) => void
  ) => {
    try {
      if (!window.FB) {
        reject(new Error('Facebook SDK not loaded'));
        return;
      }
      
      window.FB.login((response: { authResponse?: { accessToken: string } }) => {
        if (response.authResponse) {
          resolve({
            accessToken: response.authResponse.accessToken,
          });
        } else {
          reject(new Error('Facebook login was cancelled'));
        }
      }, {
        scope: 'email,public_profile',
        return_scopes: true,
      });
    } catch (error) {
      reject(error);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{t('orContinueWith')}</span>
        </div>
      </div>

      <div className="space-y-3">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialLogin('google')}
          loading={loadingProvider === 'google'}
          disabled={socialLoginMutation.isPending}
        />
        
        <SocialLoginButton
          provider="facebook"
          onClick={() => handleSocialLogin('facebook')}
          loading={loadingProvider === 'facebook'}
          disabled={socialLoginMutation.isPending}
        />
      </div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select: boolean; cancel_on_tap_outside: boolean }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
        };
      };
    };
    FB?: {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options?: { scope: string; return_scopes: boolean }) => void;
    };
  }
}
