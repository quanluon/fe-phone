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
import { adminStatsApi, type AdminOrderStats, type AdminProductStats } from '@/lib/api/admin';

const { Title, Text } = Typography;

interface Stats {
  products: AdminProductStats | null;
  orders: AdminOrderStats | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: null, orders: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminStatsApi.getProductStats(), adminStatsApi.getOrderStats()])
      .then(([products, orders]) => {
        setStats({ products: products.data, orders: orders.data });
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
              value={stats.products?.overview.totalProducts ?? 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang bán"
              value={stats.products?.overview.activeProducts ?? 0}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.orders?.totalOrders ?? 0}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn chờ xử lý"
              value={stats.orders?.pendingOrders ?? 0}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn đã giao"
              value={stats.orders?.deliveredOrders ?? 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm nổi bật"
              value={stats.products?.overview.featuredProducts ?? 0}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm mới"
              value={stats.products?.overview.newProducts ?? 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn đã huỷ"
              value={stats.orders?.cancelledOrders ?? 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={24} lg={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.orders?.totalRevenue ?? 0}
              prefix={<DollarOutlined />}
              suffix="₫"
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Giá trung bình"
              value={stats.products?.overview.averagePrice ?? 0}
              suffix="₫"
              formatter={(v) => Math.round(Number(v)).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 14 }}>Thấp nhất</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {(stats.products?.overview.minPrice ?? 0).toLocaleString('vi-VN')}₫
                </div>
              </div>
              <div style={{ width: 1, backgroundColor: '#f0f0f0', margin: '0 16px' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 14 }}>Cao nhất</Text>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {(stats.products?.overview.maxPrice ?? 0).toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ theo loại" styles={{ body: { padding: 0 } }}>
             <Row style={{ padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>
               <Col span={18}>Loại sản phẩm</Col>
               <Col span={6}>Số lượng</Col>
             </Row>
             {stats.products?.byType.map((item) => (
               <Row key={item._id} style={{ padding: '12px 24px', borderBottom: '1px solid #f0f0f0' }}>
                 <Col span={18} style={{ textTransform: 'capitalize' }}>{item._id}</Col>
                 <Col span={6}>{item.count}</Col>
               </Row>
             ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ theo danh mục" styles={{ body: { padding: 0 } }}>
             <Row style={{ padding: '16px 24px', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>
               <Col span={18}>Danh mục</Col>
               <Col span={6}>Số lượng</Col>
             </Row>
             {stats.products?.byCategory.map((item) => (
               <Row key={item._id} style={{ padding: '12px 24px', borderBottom: '1px solid #f0f0f0' }}>
                 <Col span={18}>{item._id}</Col>
                 <Col span={6}>{item.count}</Col>
               </Row>
             ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
