'use client';

import { Button } from '@/components/ui/Button';
import { useRegister } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';
import { RegisterRequest } from '@/types';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const t = useTranslations('auth');
  const { mutate: register, isPending } = useRegister();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: RegisterRequest) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    register(values, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: t('register.successTitle'),
          message: t('register.successMessage'),
        });
        onSuccess();
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error, t('register.errorMessage'));
        addToast({
          type: 'error',
          title: t('register.errorTitle'),
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label={t('register.firstName')}
            rules={[
              { required: true, message: t('validation.firstNameRequired') },
            ]}
          >
            <Input
              placeholder={t('register.firstNamePlaceholder')}
              autoComplete="given-name"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label={t('register.lastName')}
            rules={[
              { required: true, message: t('validation.lastNameRequired') },
            ]}
          >
            <Input
              placeholder={t('register.lastNamePlaceholder')}
              autoComplete="family-name"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="email"
        label={t('register.email')}
        rules={[
          { required: true, message: t('validation.emailRequired') },
          { type: 'email', message: t('validation.emailInvalid') },
        ]}
      >
        <Input
          type="email"
          placeholder={t('register.emailPlaceholder')}
          autoComplete="email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label={`${t('register.phone')} (${t('register.optional')})`}
      >
        <Input
          type="tel"
          placeholder={t('register.phonePlaceholder')}
          autoComplete="tel"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={t('register.password')}
        rules={[
          { required: true, message: t('validation.passwordRequired') },
          { min: 6, message: t('validation.passwordMinLength') },
        ]}
      >
        <Input.Password
          placeholder={t('register.passwordPlaceholder')}
          autoComplete="new-password"
          size="large"
          iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label={t('register.confirmPassword')}
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
          placeholder={t('register.confirmPasswordPlaceholder')}
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
          {(isPending || isSubmitting) ? t('register.creatingAccount') : t('register.createAccount')}
        </Button>
      </Form.Item>

      {/* <SocialLogin onSuccess={onSuccess} className="mt-6" /> */}
    </Form>
  );
}