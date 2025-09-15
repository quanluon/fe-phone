'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useResetPassword } from '@/hooks/useAuth';
import { useToastStore } from '@/stores/toast';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';

interface ResetPasswordFormProps {
  token: string;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function ResetPasswordForm({ token, onSuccess, onSwitchToLogin }: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const { mutate: resetPassword, isPending } = useResetPassword();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: { email: string; confirmationCode: string; password: string; confirmPassword: string }) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    resetPassword({ email: values.email, confirmationCode: values.confirmationCode, newPassword: values.password }, {
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
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
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
          name="email"
          label={t('auth.login.email')}
          rules={[
            { required: true, message: t('validation.emailRequired') },
            { type: 'email', message: t('validation.emailInvalid') },
          ]}
        >
          <Input
            type="email"
            placeholder={t('auth.login.emailPlaceholder')}
            autoComplete="email"
            size="large"
          />
        </Form.Item>

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
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isPending || isSubmitting}
        >
          {(isPending || isSubmitting) ? t('resetPassword.resetting') : t('resetPassword.resetPassword')}
        </Button>
      </Form.Item>
    </Form>
  );
}