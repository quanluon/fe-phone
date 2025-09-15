'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ConfirmForgotPasswordForm } from '@/components/auth/ConfirmForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'confirm-forgot-password' | 'reset-password';

export default function AuthPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Handle URL parameters
  useEffect(() => {
    const modeParam = searchParams.get('mode') as AuthMode;
    const token = searchParams.get('token');
    
    if (modeParam && ['login', 'register', 'forgot-password', 'confirm-forgot-password', 'reset-password'].includes(modeParam)) {
      setMode(modeParam);
    }
    
    if (token) {
      setResetToken(token);
      setMode('reset-password');
    }
  }, [searchParams]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url.toString());
  };

  const handleLoginSuccess = () => {
    router.push('/');
  };

  const handleRegisterSuccess = () => {
    router.push('/');
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setForgotPasswordEmail(email);
    setMode('confirm-forgot-password');
  };

  const handleConfirmForgotPasswordBack = () => {
    setMode('forgot-password');
    setForgotPasswordEmail('');
  };

  const handleResetPasswordSuccess = () => {
    setMode('login');
  };

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-start pt-24 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'login' && t('login.title')}
            {mode === 'register' && t('register.title')}
            {mode === 'forgot-password' && t('forgotPassword.title')}
            {mode === 'confirm-forgot-password' && t('resetPassword.title')}
            {mode === 'reset-password' && t('resetPassword.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' && t('login.subtitle')}
            {mode === 'register' && t('register.subtitle')}
            {mode === 'forgot-password' && t('forgotPassword.subtitle')}
            {mode === 'confirm-forgot-password' && t('resetPassword.subtitle')}
            {mode === 'reset-password' && t('resetPassword.subtitle')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'login' && (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => handleModeChange('register')}
              onSwitchToForgotPassword={() => handleModeChange('forgot-password')}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => handleModeChange('login')}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onSuccess={handleForgotPasswordSuccess}
              onSwitchToLogin={() => handleModeChange('login')}
            />
          )}

          {mode === 'confirm-forgot-password' && (
            <ConfirmForgotPasswordForm
              email={forgotPasswordEmail}
              onSuccess={handleResetPasswordSuccess}
              onBack={handleConfirmForgotPasswordBack}
            />
          )}

          {mode === 'reset-password' && resetToken && (
            <ResetPasswordForm
              token={resetToken}
              onSuccess={handleResetPasswordSuccess}
              onSwitchToLogin={() => handleModeChange('login')}
            />
          )}
        </Card>

        {/* Mode Switcher */}
        <div className="mt-6 text-center flex items-center">
          {mode === 'login' && (
            <p className="text-sm text-gray-600">
              {t('login.noAccount')}{' '}
              <button
                onClick={() => handleModeChange('register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('login.createAccount')}
              </button>
            </p>
          )}

          {mode === 'register' && (
            <p className="text-sm text-gray-600">
              {t('register.haveAccount')}{' '}
              <button
                onClick={() => handleModeChange('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('register.signIn')}
              </button>
            </p>
          )}

          {mode === 'forgot-password' && (
            <p className="text-sm text-gray-600">
              {t('forgotPassword.rememberPassword')}{' '}
              <button
                onClick={() => handleModeChange('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('forgotPassword.backToLogin')}
              </button>
            </p>
          )}

          {mode === 'confirm-forgot-password' && (
            <p className="text-sm text-gray-600">
              {t('resetPassword.rememberPassword')}{' '}
              <button
                onClick={() => handleModeChange('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('resetPassword.backToLogin')}
              </button>
            </p>
          )}

          {mode === 'reset-password' && (
            <p className="text-sm text-gray-600">
              {t('resetPassword.rememberPassword')}{' '}
              <button
                onClick={() => handleModeChange('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('resetPassword.backToLogin')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
