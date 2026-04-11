'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { App, Breadcrumb } from 'antd';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { adminProductsApi } from '@/lib/api/admin';
import { Product } from '@/types';

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { apiKey } = useParams();
  const { message } = App.useApp();

  const handleCreate = async (values: Partial<Product>) => {
    setLoading(true);
    try {
      await adminProductsApi.create(values);
      message.success('Tạo sản phẩm thành công');
      router.push(`/${apiKey}/dashboard/products`);
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || 'Lỗi khi tạo sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Breadcrumb 
        className="mb-6"
        items={[
          { title: <Link href={`/${apiKey}/dashboard`}>Dashboard</Link> },
          { title: <Link href={`/${apiKey}/dashboard/products`}>Sản phẩm</Link> },
          { title: 'Tạo mới' },
        ]}
      />

      <ProductForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}
