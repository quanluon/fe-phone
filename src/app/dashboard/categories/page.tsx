'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminCategoriesApi } from '@/lib/api/admin';
import type { Category } from '@/types';

const { Title } = Typography;

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { message } = App.useApp();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminCategoriesApi.getAll(search || undefined);
      setCategories(res.data ?? []);
    } catch {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, [search, message]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    try {
      await adminCategoriesApi.delete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      message.success('Đã xoá danh mục');
    } catch {
      message.error('Không thể xoá danh mục');
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 72,
      render: (image: string, record: Category) =>
        image ? (
          <Image width={40} height={40} src={image} alt={record.name} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              background: '#f0f0f0',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: '#999',
            }}
          >
            N/A
          </div>
        ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: Category) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 110,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Ẩn'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: Category) => (
        <Popconfirm
          title="Xoá danh mục này?"
          onConfirm={() => handleDelete(record._id)}
          okText="Xoá"
          cancelText="Huỷ"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Danh mục
        </Title>
        <Button type="primary" icon={<PlusOutlined />} disabled>
          Thêm mới
        </Button>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm danh mục..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={fetchCategories}
            allowClear
            style={{ width: 260 }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchCategories}>
            Làm mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          pagination={{ showSizeChanger: true, showTotal: (t) => `${t} danh mục` }}
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}
