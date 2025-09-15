'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useForgotPassword } from '@/hooks/useAuth';
import { useToastStore } from '@/stores/toast';
import { Form, Input } from 'antd';
import { getErrorMessage } from '@/lib/utils';

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: { email: string }) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    forgotPassword(values.email, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: t('forgotPassword.successTitle'),
          message: t('forgotPassword.successMessage'),
        });
        onSuccess(values.email);
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error, t('forgotPassword.errorMessage'));
        addToast({
          type: 'error',
          title: t('forgotPassword.errorTitle'),
          message: errorMessage,
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="space-y-6"
    >
      <Form.Item
        name="email"
        label={t('forgotPassword.email')}
        rules={[
          { required: true, message: t('validation.emailRequired') },
          { type: 'email', message: t('validation.emailInvalid') },
        ]}
      >
        <Input
          type="email"
          placeholder={t('forgotPassword.emailPlaceholder')}
          autoComplete="email"
          size="large"
        />
      </Form.Item>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {t('forgotPassword.instructions')}
        </p>
      </div>

      <Form.Item className="mb-0">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isPending || isSubmitting}
        >
          {(isPending || isSubmitting) ? t('forgotPassword.sending') : t('forgotPassword.sendResetLink')}
        </Button>
      </Form.Item>
    </Form>
  );
}