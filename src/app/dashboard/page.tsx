'use client';

import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import {
  AppstoreOutlined,
  DollarOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { adminStatsApi } from '@/lib/api/admin';

const { Title } = Typography;

interface Stats {
  products: { total: number; active: number; draft: number; inactive: number } | null;
  orders: {
    total: number;
    pending: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: null, orders: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminStatsApi.getProductStats(), adminStatsApi.getOrderStats()])
      .then(([products, orders]) => {
        setStats({ products: products.data, orders: orders.data as Stats['orders'] });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Tổng quan
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.products?.total ?? 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm đang bán"
              value={stats.products?.active ?? 0}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.orders?.total ?? 0}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn chờ xử lý"
              value={stats.orders?.pending ?? 0}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Doanh thu (đã giao)"
              value={stats.orders?.totalRevenue ?? 0}
              prefix={<DollarOutlined />}
              suffix="₫"
              formatter={(v) =>
                Number(v).toLocaleString('vi-VN')
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Đơn đã giao"
              value={stats.orders?.delivered ?? 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Đơn đã huỷ"
              value={stats.orders?.cancelled ?? 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
