'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Image,
  Input,
  Row,
  Select,
  Space,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useParams, useRouter } from 'next/navigation';
import { adminProductsApi, type AdminProductFilters } from '@/lib/api/admin';
import { Pagination, Product, ProductStatus } from '@/types';
import { getProductCardImage } from '@/lib/utils';

const { Title } = Typography;
const { Option } = Select;

const DEFAULT_PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: ProductStatus; label: string; color: string }[] = [
  { value: ProductStatus.ACTIVE, label: 'Đang bán', color: 'green' },
  { value: ProductStatus.INACTIVE, label: 'Ẩn', color: 'red' },
  { value: ProductStatus.DRAFT, label: 'Nháp', color: 'default' },
];

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState<AdminProductFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  
  const { message } = App.useApp();
  const router = useRouter();
  const { apiKey } = useParams();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminProductsApi.getAll(filters);
      setProducts(res.data ?? []);
      if (res.pagination) setPagination(res.pagination);
    } catch {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [filters, message]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    setFilters((prev) => ({
      ...prev,
      page: pag.current ?? 1,
      limit: pag.pageSize ?? DEFAULT_PAGE_SIZE,
    }));
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminProductsApi.updateStatus(id, status);
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, status: status as ProductStatus } : p)));
      message.success('Đã cập nhật trạng thái');
    } catch {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handleEdit = (record: Product) => {
    router.push(`/${apiKey}/dashboard/products/edit/${record._id}`);
  };

  const handleCreate = () => {
    router.push(`/${apiKey}/dashboard/products/create`);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminProductsApi.delete(id);
      setProducts(p => p.filter(x => x._id !== id));
      message.success('Đã xoá sản phẩm');
    } catch {
      message.error('Không thể xoá sản phẩm');
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Ảnh',
      key: 'image',
      width: 60,
      render: (_, record: Product) =>
        getProductCardImage(record) ? (
          <Image
            width={40}
            height={40}
            src={getProductCardImage(record)}
            alt={record.name}
            style={{ objectFit: 'contain', borderRadius: 4, background: '#f8fafc', padding: 4 }}
            preview={false}
          />
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
      title: 'Sản phẩm',
      key: 'name',
      render: (_, record: Product) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      key: 'category',
      width: 130,
      render: (_, record: Product) => record.category?.name || '—',
    },
    {
      title: 'Thương hiệu',
      key: 'brand',
      width: 110,
      render: (_, record: Product) => record.brand?.name || '—',
    },
    {
      title: 'Giá',
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 130,
      sorter: true,
      render: (price: number) => <span style={{ fontWeight: 500 }}>{price.toLocaleString('vi-VN')}₫</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: ProductStatus, record: Product) => (
        <Select
          value={status}
          size="small"
          style={{ width: '100%' }}
          onChange={(v) => handleStatusChange(record._id, v)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              <Tag color={opt.color} style={{ margin: 0 }}>{opt.label}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Nổi bật',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      width: 80,
      render: (v: boolean) => v ? <Tag color="gold">Nổi bật</Tag> : null,
    },
    {
      title: 'Mới',
      dataIndex: 'isNew',
      key: 'isNew',
      width: 70,
      render: (v: boolean) => v ? <Tag color="blue">Mới</Tag> : null,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_, record: Product) => (
        <Space>
          <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xoá sản phẩm?" onConfirm={() => handleDelete(record._id)}>
             <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Sản phẩm
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchProducts}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Thêm mới
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm theo tên sản phẩm..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
              allowClear
              style={{ width: '100%' }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button onClick={() => setFilters({ page: 1, limit: DEFAULT_PAGE_SIZE })}>
              Xoá lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} sản phẩm`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
