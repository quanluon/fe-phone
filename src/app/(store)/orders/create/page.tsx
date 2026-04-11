"use client";

import { NextImage } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useProfile } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useCreateOrder } from "@/hooks/useOrders";
import { PAYMENT_METHODS } from "@/lib/constants";
import { logger } from "@/lib/utils/logger";
import { ApiErrorResponse, CreateOrderRequest } from "@/types";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/stores/toast";
import { CreditCardIcon, MapPinIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const saveOrderInfoToLocalStorage = (formData: OrderFormData) => {
  try {
    localStorage.setItem(SAVED_ORDER_INFO_KEY, JSON.stringify(formData));
  } catch (error) {
    logger.error({ error }, "Failed to save order info to localStorage");
  }
};

const loadOrderInfoFromLocalStorage = (): Partial<OrderFormData> | null => {
  try {
    const savedData = localStorage.getItem(SAVED_ORDER_INFO_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    logger.error({ error }, "Failed to load order info from localStorage");
    return null;
  }
};

export default function CreateOrderPage() {
  const router = useRouter();
  const t = useTranslations("orders.create");
  const tCart = useTranslations("cart");
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const { data: userProfile } = useProfile();
  const { addToast } = useToastStore();
  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const savedInfo = loadOrderInfoFromLocalStorage();
    if (savedInfo) {
      setFormData((prev) => ({
        ...prev,
        ...savedInfo,
        notes: "",
        paymentMethod: prev.paymentMethod,
      }));
    }
  }, []);

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
      }));
    }
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items.length, router]);

  const handleInputChange = (field: keyof OrderFormData, subField: string, value: string) => {
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

  const validateStep1 = () => {
    const { customer } = formData;
    if (!customer.name.trim()) {
      addToast({ title: "Lỗi", message: t("validation.nameRequired"), type: "error" });
      return false;
    }
    if (!customer.email.trim()) {
      addToast({ title: "Lỗi", message: t("validation.emailRequired"), type: "error" });
      return false;
    }
    if (!customer.phone.trim()) {
      addToast({ title: "Lỗi", message: t("validation.phoneRequired"), type: "error" });
      return false;
    }
    return true;
  };

  const paymentMethods = PAYMENT_METHODS.map((method) => ({
    value: method.value,
    label: t(method.label),
  }));

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
        saveOrderInfoToLocalStorage(formData);
        addToast({
          title: t("success.title"),
          message: t("success.message", { orderNumber: order.orderNumber }),
          type: "success",
        });
        clearCart();
        router.push(`/orders/${order.orderNumber}`);
      },
      onError: (error: unknown) => {
        addToast({
          title: t("error.title"),
          message: (error as ApiErrorResponse)?.response?.data?.message || t("error.message"),
          type: "error",
        });
      },
    });
  };

  const subtotal = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(totalPrice);
  }, [totalPrice]);

  if (items.length === 0) {
    return null;
  }

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)] pb-28 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("title")}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{t("subtitle")}</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left ${
              step === 1 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <UserCircleIcon className="h-6 w-6" />
            <div>
              <p className="text-sm font-semibold">{t("customerInfo.title")}</p>
              <p className={`text-xs ${step === 1 ? "text-white/70" : "text-slate-500"}`}>Contact and delivery information</p>
            </div>
          </button>
          <button
            onClick={() => validateStep1() && setStep(2)}
            className={`flex items-center gap-3 rounded-[1.5rem] border px-4 py-4 text-left ${
              step === 2 ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <CreditCardIcon className="h-6 w-6" />
            <div>
              <p className="text-sm font-semibold">{t("payment.title")}</p>
              <p className={`text-xs ${step === 2 ? "text-white/70" : "text-slate-500"}`}>Payment method and notes</p>
            </div>
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_24rem]">
          <div className="space-y-5">
            {step === 1 && (
              <>
                <Card className="border-slate-200 bg-white p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      <UserCircleIcon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{t("customerInfo.title")}</h2>
                      <p className="text-sm text-slate-500">Use your details for order confirmation and support.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">{t("customerInfo.name")} *</label>
                      <Input
                        value={formData.customer.name}
                        onChange={(e) => handleInputChange("customer", "name", e.target.value)}
                        placeholder={t("customerInfo.namePlaceholder")}
                        className="border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{t("customerInfo.email")} *</label>
                      <Input
                        type="email"
                        value={formData.customer.email}
                        onChange={(e) => handleInputChange("customer", "email", e.target.value)}
                        placeholder={t("customerInfo.emailPlaceholder")}
                        className="border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{t("customerInfo.phone")} *</label>
                      <Input
                        value={formData.customer.phone}
                        onChange={(e) => handleInputChange("customer", "phone", e.target.value)}
                        placeholder={t("customerInfo.phonePlaceholder")}
                        className="border-slate-200 bg-slate-50"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="border-slate-200 bg-white p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      <MapPinIcon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{t("shippingAddress.title")}</h2>
                      <p className="text-sm text-slate-500">{t("shippingAddress.description")}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{t("shippingAddress.address")}</label>
                      <Input
                        value={formData.shippingAddress.address}
                        onChange={(e) => handleShippingInputChange("address", e.target.value)}
                        placeholder={t("shippingAddress.addressPlaceholder")}
                        className="border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{t("shippingAddress.city")}</label>
                        <Input
                          value={formData.shippingAddress.city}
                          onChange={(e) => handleShippingInputChange("city", e.target.value)}
                          placeholder={t("shippingAddress.cityPlaceholder")}
                          className="border-slate-200 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{t("shippingAddress.district")}</label>
                        <Input
                          value={formData.shippingAddress.district}
                          onChange={(e) => handleShippingInputChange("district", e.target.value)}
                          placeholder={t("shippingAddress.districtPlaceholder")}
                          className="border-slate-200 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{t("shippingAddress.ward")}</label>
                        <Input
                          value={formData.shippingAddress.ward}
                          onChange={(e) => handleShippingInputChange("ward", e.target.value)}
                          placeholder={t("shippingAddress.wardPlaceholder")}
                          className="border-slate-200 bg-slate-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{t("shippingAddress.postalCode")}</label>
                      <Input
                        value={formData.shippingAddress.postalCode}
                        onChange={(e) => handleShippingInputChange("postalCode", e.target.value)}
                        placeholder={t("shippingAddress.postalCodePlaceholder")}
                        className="border-slate-200 bg-slate-50"
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {step === 2 && (
              <Card className="border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold text-slate-950">{t("payment.title")}</h2>
                <p className="mt-2 text-sm text-slate-500">Choose the payment option and leave optional delivery notes.</p>

                <div className="mt-6 space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-[1.5rem] border px-4 py-4 transition-colors ${
                        formData.paymentMethod === method.value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                        className="mt-1"
                      />
                      <span className="text-sm font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t("payment.notes")}</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={t("payment.notesPlaceholder")}
                    rows={5}
                    className="rounded-[1.25rem] border-slate-200 bg-slate-50"
                  />
                </div>
              </Card>
            )}

            <div className="hidden justify-between gap-3 lg:flex">
              <Button variant="outline" size="lg" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
                {t("navigation.back")}
              </Button>
              {step < 2 ? (
                <Button variant="brand" size="lg" onClick={() => validateStep1() && setStep(2)}>
                  {t("navigation.continue")}
                </Button>
              ) : (
                <Button
                  variant="brand"
                  size="xl"
                  onClick={handleSubmitOrder}
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? t("navigation.processing") : t("navigation.placeOrder")}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24 border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-950">{t("orderSummary.title")}</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 rounded-[1.25rem] bg-slate-50 p-3">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white">
                      <NextImage
                        src={item.variant.images[0] || item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.variant.color} - {item.variant.storage}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {tCart("quantity")}: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.variant.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">{subtotal}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium text-emerald-600">{tCart("free")}</span>
                </div>
                <div className="mt-3 border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{tCart("total")}</span>
                    <span className="text-2xl font-semibold text-slate-950">{subtotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-600">
                <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">Secure payment and order confirmation after submission.</div>
                <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">Shipping details remain editable before placing the order.</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-500">{tCart("total")}</p>
            <p className="text-lg font-semibold text-slate-950">{subtotal}</p>
          </div>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              {t("navigation.back")}
            </Button>
          )}
          {step < 2 ? (
            <Button variant="brand" onClick={() => validateStep1() && setStep(2)}>
              {t("navigation.continue")}
            </Button>
          ) : (
            <Button
              variant="brand"
              onClick={handleSubmitOrder}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? t("navigation.processing") : t("navigation.placeOrder")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
