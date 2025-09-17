import type {
  CreateOrderRequest,
  Order,
  OrderFilters
} from "../../types";
import { api } from "./config";


export const ordersApi = {
  // Create a new order
  createOrder: async (orderData: CreateOrderRequest) => {
    return api.post<Order>("orders", orderData);
  },

  // Get user's orders
  getUserOrders: async (
    filters?: OrderFilters & { page?: number; limit?: number }
  ) => {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.paymentStatus)
      params.append("paymentStatus", filters.paymentStatus);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    return api.get<Order[]>(`orders?${params.toString()}`);
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    return api.get<Order>(`orders/${id}`);
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber: string) => {
    return api.get<Order>(`orders/number/${orderNumber}`);
  },
};
