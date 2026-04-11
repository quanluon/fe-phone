import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, Switch, Tag } from 'antd';
import { Product, ProductStatus } from '@/types';

const { Option } = Select;
const { TextArea } = Input;

export interface DashboardProductModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Product>) => Promise<void>;
  initialData?: Product;
  loading?: boolean;
}

export default function DashboardProductModal({
  open,
  onCancel,
  onSubmit,
  initialData,
  loading = false,
}: DashboardProductModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          category: initialData.category?._id || initialData.category,
          brand: initialData.brand?._id || initialData.brand,
          images: initialData.images?.join('\n') || '',
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: ProductStatus.DRAFT,
          isFeatured: false,
          isNew: false,
        });
      }
    }
  }, [open, initialData, form]);

  const handleFinish = async (values: Partial<Product> & { images?: string }) => {
    const formattedValues = {
      ...values,
      images: values.images?.split('\n').map((url: string) => url.trim()).filter(Boolean) || [],
    };
    await onSubmit(formattedValues);
  };

  return (
    <Modal
      open={open}
      title={initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      width={720}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="Ví dụ: iPhone 15 Pro Max" />
          </Form.Item>
          
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
            <Input placeholder="ví-dụ-iphone-15-pro-max" />
          </Form.Item>

          <Form.Item name="basePrice" label="Giá bán (₫)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
            <InputNumber<number> style={{ width: '100%' }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => Number(v?.replace(/\$\s?|(,*)/g, ''))} />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Trạng thái không được để trống' }]}>
            <Select>
              <Option value={ProductStatus.ACTIVE}><Tag color="green">Đang bán</Tag></Option>
              <Option value={ProductStatus.INACTIVE}><Tag color="red">Ẩn</Tag></Option>
              <Option value={ProductStatus.DRAFT}><Tag color="default">Nháp</Tag></Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="category" label="ID Danh mục">
            <Input placeholder="Object ID của danh mục" />
          </Form.Item>
          
          <Form.Item name="brand" label="ID Thương hiệu">
            <Input placeholder="Object ID của thương hiệu" />
          </Form.Item>
        </div>

        <Form.Item name="images" label="Hình ảnh (Mỗi link một dòng)">
          <TextArea rows={4} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả chi tiết">
          <TextArea rows={5} />
        </Form.Item>

        <div style={{ display: 'flex', gap: 24 }}>
          <Form.Item name="isFeatured" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Switch checkedChildren="Nổi bật" unCheckedChildren="Bình thường" />
          </Form.Item>
          
          <Form.Item name="isNew" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Switch checkedChildren="Mới" unCheckedChildren="Không" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
