'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/stores/toast';

interface ConfirmForgotPasswordFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ConfirmForgotPasswordForm({ email, onSuccess, onBack }: ConfirmForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const { addToast } = useToastStore();

  return (
    <div className="space-y-6">
      {/* Email display */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>{t('resetPassword.emailSentTo')}:</strong> {email}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {t('resetPassword.checkEmailInstructions')}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
        {t('forgotPassword.instructions')}
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            addToast({
              type: 'info',
              message: t('forgotPassword.successMessage'),
            });
            onSuccess();
          }}
        >
          {t('resetPassword.backToLogin')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          {t('common.back')}
        </Button>
      </div>
    </div>
  );
}
