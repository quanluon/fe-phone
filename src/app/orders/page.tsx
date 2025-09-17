"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { NextImage } from "@/components/ui";
import { useUserOrders } from "@/hooks/useOrders";

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatus.PROCESSING]: "bg-purple-100 text-purple-800",
  [OrderStatus.SHIPPED]: "bg-indigo-100 text-indigo-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [PaymentStatus.PAID]: "bg-green-100 text-green-800",
  [PaymentStatus.FAILED]: "bg-red-100 text-red-800",
  [PaymentStatus.REFUNDED]: "bg-gray-100 text-gray-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const t = useTranslations('orders');
  const { addToast } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  
  const { 
    data: ordersData, 
    isLoading: loading, 
    error
  } = useUserOrders({ page, limit: 10 });

  const orders = ordersData || [];
  const pagination = { pages: 1 }; // Simplified for now
  const hasMore = page < (pagination?.pages || 0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      addToast({
        title: t('errorLoading'),
        message: t('errorMessage'),
        type: "error",
      });
    }
  }, [error, addToast, t]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('subtitle')}
          </p>
        </div>

        {loading && orders.length === 0 ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('empty')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('emptyDescription')}
            </p>
            <Button onClick={() => router.push("/products")}>
              {t('startShopping')}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <Card
                key={order._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('orderNumber', { orderNumber: order.orderNumber })}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={statusColors[order.status as OrderStatus]}>
                      {t(`status.${order.status}`)}
                    </Badge>
                    <Badge className={paymentStatusColors[order.paymentStatus as PaymentStatus]}>
                      {t(`paymentStatus.${order.paymentStatus}`)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Sản phẩm</p>
                    <p className="font-medium">{order.items.length} sản phẩm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('totalAmount')}</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('customer')}</p>
                    <p className="font-medium">
                      {order.customer.name || order.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {order.items.slice(0, 3).map((item, index: number) => (
                      <NextImage
                        key={index}
                        src={item.variant?.images?.[0] || item.product.images[0] || ""}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/orders/${order.orderNumber}`)}
                  >
                    {t('viewDetails')}
                  </Button>
                </div>
              </Card>
            ))}

            {hasMore && (
              <div className="text-center">
                <Button onClick={loadMore} disabled={loading} variant="outline">
                  {loading ? t('loading') : t('loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
