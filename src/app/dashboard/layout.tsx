'use client';

import React, { useState } from 'react';
import {
  AppstoreOutlined,
  BarsOutlined,
  DashboardOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { App, Avatar, Button, Dropdown, Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/dashboard/orders', icon: <OrderedListOutlined />, label: 'Đơn hàng' },
  { key: '/dashboard/products', icon: <ShoppingOutlined />, label: 'Sản phẩm' },
  { key: '/dashboard/brands', icon: <AppstoreOutlined />, label: 'Thương hiệu' },
  { key: '/dashboard/categories', icon: <TagsOutlined />, label: 'Danh mục' },
  { key: '/dashboard/users', icon: <TeamOutlined />, label: 'Người dùng' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { modal } = App.useApp();

  // Guard: redirect non-admins
  if (user && user.type !== 'admin') {
    router.replace('/');
    return null;
  }

  const handleLogout = () => {
    modal.confirm({
      title: 'Đăng xuất',
      content: 'Bạn có chắc muốn đăng xuất?',
      onOk: () => logout(),
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuProps['items'] = NAV_ITEMS.map(({ key, icon, label }) => ({
    key,
    icon,
    label: <Link href={key}>{label}</Link>,
  }));

  const selectedKey =
    NAV_ITEMS.slice()
      .reverse()
      .find((item) => pathname === item.key || pathname?.startsWith(item.key + '/'))?.key ??
    '/dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#001529' }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            color: '#fff',
            fontWeight: 700,
            fontSize: collapsed ? 14 : 16,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {collapsed ? 'CP' : 'Cong Phone Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={<BarsOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar style={{ background: '#1677ff' }}>
                {user?.firstName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'A'}
              </Avatar>
              {!collapsed && (
                <Text style={{ maxWidth: 160 }} ellipsis>
                  {user?.fullName ?? user?.email ?? 'Admin'}
                </Text>
              )}
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
