"use client";

import { NextImage } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useProfile } from "@/hooks/useAuth";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/stores/toast";
import { ApiErrorResponse, CreateOrderRequest } from "@/types";
import { PAYMENT_METHODS } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Constants for localStorage
const SAVED_ORDER_INFO_KEY = "savedOrderInfo";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
}

interface ShippingFormData {
  address: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
}

interface OrderFormData {
  customer: CustomerFormData;
  shippingAddress: ShippingFormData;
  notes: string;
  paymentMethod: string;
}

const initialFormData: OrderFormData = {
  customer: {
    name: "",
    email: "",
    phone: "",
  },
  shippingAddress: {
    address: "",
    city: "",
    district: "",
    ward: "",
    postalCode: "",
  },
  notes: "",
  paymentMethod: "cash",
};

// Helper functions for localStorage
const saveOrderInfoToLocalStorage = (formData: OrderFormData) => {
  try {
    localStorage.setItem(SAVED_ORDER_INFO_KEY, JSON.stringify(formData));
  } catch (error) {
    console.error("Failed to save order info to localStorage:", error);
  }
};

const loadOrderInfoFromLocalStorage = (): Partial<OrderFormData> | null => {
  try {
    const savedData = localStorage.getItem(SAVED_ORDER_INFO_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Failed to load order info from localStorage:", error);
    return null;
  }
};

// Payment methods will be translated in the component

export default function CreateOrderPage() {
  const router = useRouter();
  const t = useTranslations("orders.create");
  const tCart = useTranslations("cart");
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { data: userProfile } = useProfile();
  const { addToast } = useToastStore();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [step, setStep] = useState(1);

  // Load saved order info from localStorage on mount
  useEffect(() => {
    const savedInfo = loadOrderInfoFromLocalStorage();
    if (savedInfo) {
      setFormData((prev) => ({
        ...prev,
        ...savedInfo,
        // Don't load notes and payment method from previous orders
        notes: "",
        paymentMethod: prev.paymentMethod,
      }));
    }
  }, []);

  // Auto-fill user data if logged in (takes priority over saved data)
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setFormData((prev) => ({
        ...prev,
        customer: {
          name:
            userProfile.firstName && userProfile.lastName
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : userProfile.email || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
        },
        shippingAddress: {
          ...prev.shippingAddress,
          fullName:
            userProfile.firstName && userProfile.lastName
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : userProfile.email || "",
          phone: userProfile.phone || "",
        },
      }));
    }
  }, [isAuthenticated, userProfile]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  const handleInputChange = (
    field: keyof OrderFormData,
    subField: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as object),
        [subField]: value,
      },
    }));
  };

  const handleShippingInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));
  };

  const validateStep1 = (): boolean => {
    const { customer } = formData;
    if (!customer.name.trim()) {
      addToast({
        title: "Lỗi",
        message: t("validation.nameRequired"),
        type: "error",
      });
      return false;
    }
    if (!customer.email.trim()) {
      addToast({
        title: "Lỗi",
        message: t("validation.emailRequired"),
        type: "error",
      });
      return false;
    }
    if (!customer.phone.trim()) {
      addToast({
        title: "Lỗi",
        message: t("validation.phoneRequired"),
        type: "error",
      });
      return false;
    }
    return true;
  };

  // Payment methods for the form
  const paymentMethods = PAYMENT_METHODS.map(method => ({
    value: method.value,
    label: t(method.label)
  }));

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateStep1()) return;

    const orderData: CreateOrderRequest = {
      customer: {
        name: formData.customer.name,
        email: formData.customer.email,
        phone: formData.customer.phone,
      },
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shippingAddress: formData.shippingAddress,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (response) => {
        const order = response.data;
        
        // Save form data to localStorage for future orders
        saveOrderInfoToLocalStorage(formData);
        
        addToast({
          title: t("success.title"),
          message: t("success.message", { orderNumber: order.orderNumber }),
          type: "success",
        });

        // Clear cart and redirect
        clearCart();
        router.push(`/orders/${order.orderNumber}`);
      },
      onError: (error: unknown) => {
        console.error("Failed to create order:", error);
        addToast({
          title: t("error.title"),
          message:
            (error as ApiErrorResponse)?.response?.data?.message ||
            t("error.message"),
          type: "error",
        });
      },
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Information & Shipping Address */}
            {step === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {t("customerInfo.title")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("customerInfo.name")} *
                    </label>
                    <Input
                      value={formData.customer.name}
                      onChange={(e) =>
                        handleInputChange("customer", "name", e.target.value)
                      }
                      placeholder={t("customerInfo.namePlaceholder")}
                    />
                    {isAuthenticated && (
                      <p className="text-sm text-gray-500 mt-1">
                        {t("customerInfo.fromAccount")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("customerInfo.email")} *
                    </label>
                    <Input
                      type="email"
                      value={formData.customer.email}
                      onChange={(e) =>
                        handleInputChange("customer", "email", e.target.value)
                      }
                      placeholder={t("customerInfo.emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("customerInfo.phone")} *
                    </label>
                    <Input
                      value={formData.customer.phone}
                      onChange={(e) =>
                        handleInputChange("customer", "phone", e.target.value)
                      }
                      placeholder={t("customerInfo.phonePlaceholder")}
                    />
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("shippingAddress.title")}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("shippingAddress.description")}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("shippingAddress.address")}
                      </label>
                      <Input
                        value={formData.shippingAddress.address}
                        onChange={(e) =>
                          handleShippingInputChange("address", e.target.value)
                        }
                        placeholder={t("shippingAddress.addressPlaceholder")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("shippingAddress.city")}
                        </label>
                        <Input
                          value={formData.shippingAddress.city}
                          onChange={(e) =>
                            handleShippingInputChange("city", e.target.value)
                          }
                          placeholder={t("shippingAddress.cityPlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("shippingAddress.district")}
                        </label>
                        <Input
                          value={formData.shippingAddress.district}
                          onChange={(e) =>
                            handleShippingInputChange("district", e.target.value)
                          }
                          placeholder={t("shippingAddress.districtPlaceholder")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("shippingAddress.ward")}
                        </label>
                        <Input
                          value={formData.shippingAddress.ward}
                          onChange={(e) =>
                            handleShippingInputChange("ward", e.target.value)
                          }
                          placeholder={t("shippingAddress.wardPlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("shippingAddress.postalCode")}
                      </label>
                      <Input
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) =>
                          handleShippingInputChange("postalCode", e.target.value)
                        }
                        placeholder={t("shippingAddress.postalCodePlaceholder")}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Payment & Notes */}
            {step === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  {t("payment.title")}
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t("payment.paymentMethod")}
                    </label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <label key={method.value} className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentMethod: e.target.value,
                              }))
                            }
                            className="mr-3"
                          />
                          <span className="text-gray-700">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("payment.notes")}
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder={t("payment.notesPlaceholder")}
                      rows={4}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                {t("navigation.back")}
              </Button>

              {step < 2 ? (
                <Button onClick={handleNext}>{t("navigation.continue")}</Button>
              ) : (
                <Button
                  onClick={handleSubmitOrder}
                  disabled={createOrderMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createOrderMutation.isPending
                    ? t("navigation.processing")
                    : t("navigation.placeOrder")}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("orderSummary.title")}
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex items-center space-x-3"
                  >
                    <NextImage
                      src={item.variant.images[0] || item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.variant.color} - {item.variant.storage}
                      </p>
                      <p className="text-sm text-gray-600">
                        {tCart("quantity")}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t("orderSummary.total")}:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Progress Indicator */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("progress.title")}</h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center ${
                    step >= 1 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      step >= 1 ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    1
                  </div>
                  {t("progress.step1")}
                </div>
                <div
                  className={`flex items-center ${
                    step >= 2 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      step >= 2 ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>
                  {t("progress.step3")}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
