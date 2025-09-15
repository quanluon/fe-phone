'use client';

import { Button } from '@/components/ui/Button';
import { useRegister } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { useToastStore } from '@/stores/toast';
import { RegisterRequest } from '@/types';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const t = useTranslations('auth');
  const { mutateAsync: register, isPending } = useRegister();
  const { addToast } = useToastStore();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone prefix options - currently supporting +84 (Vietnam)
  const phonePrefixOptions = [
    { value: '+84', label: '+84' },
  ];

  const handleSubmit = (values: RegisterRequest & { phonePrefix?: string }) => {
    // Prevent multiple submissions
    if (isSubmitting || isPending) {
      return;
    }

    setIsSubmitting(true);
    
    // Combine phone prefix with phone number if phone is provided
    const submitValues = { ...values };
    if (values.phone) {
      submitValues.phone = `${values.phonePrefix || '+84'}${Number(values.phone)}`;
    }
    
    // Remove phonePrefix from the values as it's not part of RegisterRequest
    delete submitValues.phonePrefix;
    
    register(submitValues, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: t('register.successTitle'),
          message: t('register.successMessage'),
        });
        // Don't reset isSubmitting on success to prevent re-submission
        onSuccess();
      },
      onError: (error: unknown) => {
        const errorMessage = getErrorMessage(error, t('register.errorMessage'));
        addToast({
          type: 'error',
          title: t('register.errorTitle'),
          message: errorMessage,
        });
        // Only reset isSubmitting on error to allow retry
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

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="phonePrefix"
            label={t('register.phonePrefix')}
          >
            <Select
              placeholder={t('register.phonePrefixPlaceholder')}
              size="large"
              options={phonePrefixOptions}
              defaultValue="+84"
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="phone"
            label={`${t('register.phone')} (${t('register.optional')})`}
            rules={[
              {
                pattern: /^[0-9]{9,10}$/,
                message: t('validation.phoneInvalid'),
              },
            ]}
          >
            <Input
              type="number"
              placeholder={t('register.phonePlaceholder')}
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

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