"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const {addToast} = useToastStore()

  const orderNumber = params.orderNumber as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await ordersApi.getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        addToast({
          title: "Không thể tải thông tin đơn hàng",
          message: "Vui lòng thử lại sau",
          type: "error",
        });
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, router, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-gray-600 mb-6">
              Đơn hàng không tồn tại hoặc bạn không có quyền xem.
            </p>
            <Button onClick={() => router.push("/orders")}>
              Quay lại danh sách đơn hàng
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Đơn hàng #{order.orderNumber}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Trạng thái đơn hàng
              </h2>
              <div className="flex items-center space-x-4">
                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
                <Badge className={paymentStatusColors[order.paymentStatus]}>
                  {paymentStatusLabels[order.paymentStatus]}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Đặt hàng lúc:{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </Card>

            {/* Order Items */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sản phẩm đã đặt</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <NextImage
                      src={item.variant?.images[0] || item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600">
                          {item.variant.color} - {item.variant.storage}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price * item.quantity)}
                      </p>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.originalPrice * item.quantity)}
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Địa chỉ giao hàng
                </h2>
                <div className="text-gray-700">
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.ward},{" "}
                    {order.shippingAddress.district},{" "}
                    {order.shippingAddress.city}
                  </p>
                  {order.shippingAddress.postalCode && (
                    <p>Mã bưu điện: {order.shippingAddress.postalCode}</p>
                  )}
                </div>
              </Card>
            )}

            {/* Notes */}
            {order.notes && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ghi chú</h2>
                <p className="text-gray-700">{order.notes}</p>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.originalTotalAmount || order.totalAmount)}
                  </span>
                </div>

                {order.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>
                      -
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.discountAmount)}
                    </span>
                  </div>
                )}

                {order.shippingFee && order.shippingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.shippingFee)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin khách hàng
              </h2>
              <div className="space-y-2 text-gray-700">
                {order.customer.name && (
                  <p>
                    <strong>Tên:</strong> {order.customer.name}
                  </p>
                )}
                <p>
                  <strong>SĐT:</strong> {order.customer.phone}
                </p>
                {order.customer.email && (
                  <p>
                    <strong>Email:</strong> {order.customer.email}
                  </p>
                )}
              </div>
            </Card>

            {/* Payment Info */}
            {order.paymentMethod && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Phương thức thanh toán
                </h2>
                <p className="text-gray-700 capitalize">
                  {order.paymentMethod.replace("_", " ")}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
