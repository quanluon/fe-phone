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
import { adminBrandsApi } from '@/lib/api/admin';
import type { Brand } from '@/types';

const { Title } = Typography;

export default function DashboardBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { message } = App.useApp();

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminBrandsApi.getAll(search || undefined);
      setBrands(res.data ?? []);
    } catch {
      message.error('Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  }, [search, message]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async (id: string) => {
    try {
      await adminBrandsApi.delete(id);
      setBrands((prev) => prev.filter((b) => b._id !== id));
      message.success('Đã xoá thương hiệu');
    } catch {
      message.error('Không thể xoá thương hiệu');
    }
  };

  const columns: ColumnsType<Brand> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 72,
      render: (logo: string, record: Brand) =>
        logo ? (
          <Image width={40} height={40} src={logo} alt={record.name} style={{ objectFit: 'contain', borderRadius: 4 }} />
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
      render: (name: string, record: Brand) => (
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
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string) =>
        website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        ) : (
          '—'
        ),
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
      render: (_: unknown, record: Brand) => (
        <Popconfirm
          title="Xoá thương hiệu này?"
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
          Thương hiệu
        </Title>
        <Button type="primary" icon={<PlusOutlined />} disabled>
          Thêm mới
        </Button>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm thương hiệu..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={fetchBrands}
            allowClear
            style={{ width: 260 }}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchBrands}>
            Làm mới
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={brands}
          rowKey="_id"
          loading={loading}
          pagination={{ showSizeChanger: true, showTotal: (t) => `${t} thương hiệu` }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}
