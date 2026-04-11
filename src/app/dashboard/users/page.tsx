'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminUsersApi, type AdminUserFilters } from '@/lib/api/admin';
import type { Pagination, User } from '@/types';

const { Title } = Typography;
const { Option } = Select;

const DEFAULT_PAGE_SIZE = 20;

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState<AdminUserFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { message } = App.useApp();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminUsersApi.getAll(filters);
      setUsers(res.data ?? []);
      if (res.pagination) setPagination(res.pagination);
    } catch {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [filters, message]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    setFilters((prev) => ({ ...prev, page: pag.current ?? 1, limit: pag.pageSize ?? DEFAULT_PAGE_SIZE }));
  };

  const columns: ColumnsType<User> = [
    {
      title: '',
      key: 'avatar',
      width: 52,
      render: (_, record: User) => (
        <Avatar style={{ background: record.type === 'admin' ? '#722ed1' : '#1677ff' }}>
          {(record.firstName?.[0] ?? record.email[0]).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Họ tên',
      key: 'name',
      render: (_, record: User) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {[record.firstName, record.lastName].filter(Boolean).join(' ') || '—'}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => phone || '—',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'admin' ? 'purple' : 'blue'}>
          {type === 'admin' ? 'Admin' : 'Khách hàng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: 'green',
          inactive: 'red',
          suspended: 'orange',
        };
        const labelMap: Record<string, string> = {
          active: 'Hoạt động',
          inactive: 'Vô hiệu',
          suspended: 'Tạm khoá',
        };
        return <Tag color={colorMap[status] ?? 'default'}>{labelMap[status] ?? status}</Tag>;
      },
    },
    {
      title: 'Đăng nhập lần cuối',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 160,
      render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '—'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: true,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Người dùng
        </Title>
        <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
          Làm mới
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm theo email, tên, SĐT..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              placeholder="Loại"
              value={filters.type}
              onChange={(v) => setFilters((prev) => ({ ...prev, type: v, page: 1 }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="customer">Khách hàng</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Vô hiệu</Option>
              <Option value="suspended">Tạm khoá</Option>
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
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} người dùng`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
