import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import { queryKeys } from '@/lib/api/queryClient';
import { CreateOrderRequest, Order, OrderFilters } from '@/types';

// Get user's orders
export const useUserOrders = (filters?: OrderFilters & { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: queryKeys.orders.userOrders(filters),
    queryFn: () => ordersApi.getUserOrders(filters),
    select: (data) => data.data,
  });
};

// Get order by ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.order(id),
    queryFn: () => ordersApi.getOrderById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Get order by order number
export const useOrderByNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: queryKeys.orders.orderByNumber(orderNumber),
    queryFn: () => ordersApi.getOrderByNumber(orderNumber),
    select: (data) => data.data,
    enabled: !!orderNumber,
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => ordersApi.createOrder(orderData),
    onSuccess: (response) => {
      // Invalidate and refetch user orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.userOrders() });
      
      // Add the new order to the cache
      const newOrder = response.data;
      queryClient.setQueryData(
        queryKeys.orders.order(newOrder._id),
        { data: newOrder }
      );
      queryClient.setQueryData(
        queryKeys.orders.orderByNumber(newOrder.orderNumber),
        { data: newOrder }
      );
    },
  });
};
