"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { NextImage } from "@/components/ui";

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ xác nhận",
  [OrderStatus.CONFIRMED]: "Đã xác nhận",
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.SHIPPED]: "Đã gửi hàng",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.PAID]: "Đã thanh toán",
  [PaymentStatus.FAILED]: "Thanh toán thất bại",
  [PaymentStatus.REFUNDED]: "Đã hoàn tiền",
};

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
  const {addToast} = useToastStore()
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  const fetchOrders = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const { data = [], pagination } = await ordersApi.getUserOrders({
        page: pageNum,
        limit: 10,
      });

      if (append) {
        setOrders((prev) => [...prev, ...data]);
      } else {
        setOrders(data);
      }

      setHasMore(page < (pagination?.pages || 0));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      addToast({
        title: "Không thể tải danh sách đơn hàng",
        message: "Vui lòng thử lại sau",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [addToast, page]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router, fetchOrders]);


  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage, true);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi trạng thái đơn hàng của bạn
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
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
            </p>
            <Button onClick={() => router.push("/products")}>
              Mua sắm ngay
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Đơn hàng #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                    <Badge className={paymentStatusColors[order.paymentStatus]}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Sản phẩm</p>
                    <p className="font-medium">{order.items.length} sản phẩm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách hàng</p>
                    <p className="font-medium">
                      {order.customer.name || order.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <NextImage
                        key={index}
                        src={item.variant?.images[0] || item.product.images[0]}
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
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            ))}

            {hasMore && (
              <div className="text-center">
                <Button onClick={loadMore} disabled={loading} variant="outline">
                  {loading ? "Đang tải..." : "Tải thêm"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
