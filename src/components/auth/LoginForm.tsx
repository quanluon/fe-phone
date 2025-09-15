'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';
import { useToastStore } from '@/stores/toast';
import { LoginRequest } from '@/types';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, Input, Checkbox } from 'antd';
import { getErrorMessage } from '@/lib/utils';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onSwitchToForgotPassword }: LoginFormProps) {
  const t = useTranslations('auth');
  const { mutate: login, isPending } = useLogin();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: LoginRequest) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    login(values, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: t('login.successTitle'),
          message: t('login.successMessage'),
        });
        onSuccess();
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error, t('login.errorMessage'));
        addToast({
          type: 'error',
          title: t('login.errorTitle'),
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
      initialValues={{
        remember: false,
      }}
    >
      <Form.Item
        name="email"
        label={t('login.email')}
        rules={[
          { required: true, message: t('validation.emailRequired') },
          { type: 'email', message: t('validation.emailInvalid') },
        ]}
      >
        <Input
          placeholder={t('login.emailPlaceholder')}
          autoComplete="email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={t('login.password')}
        rules={[
          { required: true, message: t('validation.passwordRequired') },
        ]}
      >
        <Input.Password
          placeholder={t('login.passwordPlaceholder')}
          autoComplete="current-password"
          size="large"
          iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
        />
      </Form.Item>

      <Form.Item className="mb-4">
        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" className="mb-0">
            <Checkbox>{t('login.rememberMe')}</Checkbox>
          </Form.Item>

          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t('login.forgotPassword')}
          </button>
        </div>
      </Form.Item>

      <Form.Item className="mb-0">
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isPending || isSubmitting}
        >
          {(isPending || isSubmitting) ? t('login.signingIn') : t('login.signIn')}
        </Button>
      </Form.Item>
    </Form>
  );
}
