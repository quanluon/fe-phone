'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { adminOrdersApi, type AdminOrderFilters } from '@/lib/api/admin';
import { OrderStatus, PaymentStatus, Pagination, Order } from '@/types';

const { Title } = Typography;
const { Option } = Select;

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: OrderStatus.PENDING, label: 'Chờ xác nhận', color: 'orange' },
  { value: OrderStatus.CONFIRMED, label: 'Đã xác nhận', color: 'blue' },
  { value: OrderStatus.PROCESSING, label: 'Đang xử lý', color: 'cyan' },
  { value: OrderStatus.SHIPPED, label: 'Đang giao', color: 'geekblue' },
  { value: OrderStatus.DELIVERED, label: 'Đã giao', color: 'green' },
  { value: OrderStatus.CANCELLED, label: 'Đã huỷ', color: 'red' },
];

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string; color: string }[] = [
  { value: PaymentStatus.PENDING, label: 'Chưa thanh toán', color: 'orange' },
  { value: PaymentStatus.PAID, label: 'Đã thanh toán', color: 'green' },
  { value: PaymentStatus.FAILED, label: 'Thất bại', color: 'red' },
  { value: PaymentStatus.REFUNDED, label: 'Hoàn tiền', color: 'purple' },
];

const DEFAULT_PAGE_SIZE = 20;

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const { message } = App.useApp();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminOrdersApi.getAll(filters);
      setOrders(res.data ?? []);
      if (res.pagination) setPagination(res.pagination);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [filters, message]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    setFilters((prev) => ({ ...prev, page: pag.current ?? 1, limit: pag.pageSize ?? DEFAULT_PAGE_SIZE }));
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await adminOrdersApi.update(orderId, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      message.success('Đã cập nhật trạng thái đơn hàng');
    } catch {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      await adminOrdersApi.update(orderId, { paymentStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, paymentStatus } : o)));
      message.success('Đã cập nhật trạng thái thanh toán');
    } catch {
      message.error('Không thể cập nhật trạng thái thanh toán');
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 130,
      render: (text: string) => <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.customer.name || '—'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.customer.phone || record.customer.email}
          </div>
        </div>
      ),
    },
    {
      title: 'SP',
      key: 'items',
      width: 60,
      render: (_, record) => <span>{record.items.length}</span>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      sorter: true,
      render: (amount: number) => (
        <span style={{ fontWeight: 500 }}>{amount.toLocaleString('vi-VN')}₫</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: OrderStatus, record: Order) => (
        <Select
          value={status}
          size="small"
          style={{ width: '100%' }}
          onChange={(value) => handleStatusUpdate(record._id, value)}
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              <Tag color={opt.color} style={{ margin: 0 }}>{opt.label}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 160,
      render: (paymentStatus: PaymentStatus, record: Order) => (
        <Select
          value={paymentStatus}
          size="small"
          style={{ width: '100%' }}
          onChange={(value) => handlePaymentStatusUpdate(record._id, value)}
        >
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              <Tag color={opt.color} style={{ margin: 0 }}>{opt.label}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      sorter: true,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_: unknown, record: Order) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/orders/${record.orderNumber}`, '_blank')}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Đơn hàng
        </Title>
        <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
          Làm mới
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm theo mã đơn, SĐT, email..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái đơn"
              value={filters.status}
              onChange={(v) => setFilters((prev) => ({ ...prev, status: v, page: 1 }))}
              allowClear
              style={{ width: '100%' }}
            >
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <Tag color={opt.color} style={{ margin: 0 }}>{opt.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Thanh toán"
              value={filters.paymentStatus}
              onChange={(v) => setFilters((prev) => ({ ...prev, paymentStatus: v, page: 1 }))}
              allowClear
              style={{ width: '100%' }}
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  <Tag color={opt.color} style={{ margin: 0 }}>{opt.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={2}>
            <Space>
              <Button onClick={() => setFilters({ page: 1, limit: DEFAULT_PAGE_SIZE })}>
                Xoá lọc
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} đơn`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
