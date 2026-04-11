'use client';

import { Button } from '@/components/ui/Button';
import { useResetPassword } from '@/hooks/useAuth';
import { useToastStore } from '@/stores/toast';
import { ApiErrorResponse } from '@/types';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function ResetPasswordForm({ token, onSuccess, onSwitchToLogin }: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: { password: string; confirmPassword: string }) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    resetPassword({ actionCode: token, newPassword: values.password }, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: t('resetPassword.successTitle'),
          message: t('resetPassword.successMessage'),
        });
        onSuccess();
      },
      onError: (error: unknown) => {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as ApiErrorResponse).response?.data?.message 
          : t('resetPassword.errorMessage');
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
      <Form
        form={form}
        onFinish={handleSubmit}
      layout="vertical"
      className="space-y-6"
    >
        <Form.Item
          name="password"
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
        dependencies={['password']}
        rules={[
          { required: true, message: t('validation.confirmPasswordRequired') },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
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

      <Form.Item className="mb-0">
        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isPending || isSubmitting}
          >
            {(isPending || isSubmitting) ? t('resetPassword.resetting') : t('resetPassword.resetPassword')}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onSwitchToLogin}
            disabled={isPending || isSubmitting}
          >
            {t('resetPassword.backToLogin')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
