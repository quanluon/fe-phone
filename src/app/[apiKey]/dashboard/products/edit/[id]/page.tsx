'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { App, Breadcrumb, Spin } from 'antd';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
import { adminProductsApi } from '@/lib/api/admin';
import { Product } from '@/types';

export default function EditProductPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState<Product | undefined>();
  
  const router = useRouter();
  const { id, apiKey } = useParams();
  const { message } = App.useApp();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await adminProductsApi.getById(id as string);
        setProduct(res.data);
      } catch (error: any) {
        message.error('Không thể tải thông tin sản phẩm');
        router.push(`/${apiKey}/dashboard/products`);
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id, message, router]);

  const handleUpdate = async (values: Partial<Product>) => {
    setLoading(true);
    try {
      await adminProductsApi.update(id as string, values);
      message.success('Cập nhật sản phẩm thành công');
      router.push(`/${apiKey}/dashboard/products`);
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi cập nhật sản phẩm');
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
          { title: 'Chỉnh sửa' },
          { title: product?.name },
        ]}
      />

      {fetching ? (
        <div className="flex justify-center items-center h-[400px]">
          <Spin size="large" tip="Đang tải thông tin sản phẩm...">
            <div className="px-10" />
          </Spin>
        </div>
      ) : (
        <ProductForm 
          initialData={product} 
          onSubmit={handleUpdate} 
          loading={loading} 
        />
      )}
    </div>
  );
}
