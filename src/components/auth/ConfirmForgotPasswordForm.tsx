'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useResetPassword } from '@/hooks/useAuth';
import { useToastStore } from '@/stores/toast';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { getErrorMessage } from '@/lib/utils';

interface ConfirmForgotPasswordFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ConfirmForgotPasswordForm({ email, onSuccess, onBack }: ConfirmForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: { confirmationCode: string; newPassword: string; confirmPassword: string }) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    resetPassword({ 
      email, 
      confirmationCode: values.confirmationCode, 
      newPassword: values.newPassword 
    }, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: t('resetPassword.successTitle'),
          message: t('resetPassword.successMessage'),
        });
        onSuccess();
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error, t('resetPassword.errorMessage'));
        addToast({
          type: 'error',
          title: t('resetPassword.errorTitle'),
          message: errorMessage,
        });
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

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

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="space-y-6"
      >
        <Form.Item
          name="confirmationCode"
          label={t('resetPassword.confirmationCode')}
          rules={[
            { required: true, message: t('resetPassword.confirmationCodeRequired') },
            { len: 6, message: t('resetPassword.confirmationCodeLength') },
          ]}
        >
          <Input
            placeholder={t('resetPassword.confirmationCodePlaceholder')}
            autoComplete="one-time-code"
            size="large"
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={t('resetPassword.newPassword')}
          rules={[
            { required: true, message: t('validation.passwordRequired') },
            { min: 6, message: t('validation.passwordMinLength') },
          ]}
        >
          <Input.Password
            placeholder={t('resetPassword.newPasswordPlaceholder')}
            autoComplete="new-password"
            size="large"
            iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t('resetPassword.confirmPassword')}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: t('validation.confirmPasswordRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('validation.passwordsDoNotMatch')));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={t('resetPassword.confirmPasswordPlaceholder')}
            autoComplete="new-password"
            size="large"
            iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
          />
        </Form.Item>

        <div className="flex space-x-3">
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isPending || isSubmitting}
          >
            {(isPending || isSubmitting) ? t('resetPassword.resetting') : t('resetPassword.resetPassword')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isPending || isSubmitting}
          >
            {t('common.back')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
