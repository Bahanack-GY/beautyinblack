import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

/**
 * Hook personnalisé pour les opérations sur les commandes
 * Fournit les opérations CRUD pour les commandes avec React Query
 */

// Clés de requête
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), { filters }],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
  stats: () => [...orderKeys.all, 'stats'],
};

/**
 * Hook to get all orders with filters
 */
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getOrders(params),
    keepPreviousData: true,
  });
};

/**
 * Hook to get single order by ID
 */
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApi.getOrderById(orderId),
    enabled: !!orderId,
  });
};

/**
 * Hook to get order statistics
 */
export const useOrderStats = (params = {}) => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApi.getOrderStats(params),
  });
};

/**
 * Hook to create an order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

/**
 * Hook to update order status
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }) => ordersApi.updateOrderStatus(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

/**
 * Hook to update an order
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }) => ordersApi.updateOrder(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

/**
 * Combined hook for all order operations
 */
export const useOrderOperations = () => {
  const createOrder = useCreateOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateOrder = useUpdateOrder();
  const cancelOrder = useCancelOrder();

  return {
    createOrder: createOrder.mutate,
    createOrderAsync: createOrder.mutateAsync,
    isCreating: createOrder.isPending,
    createError: createOrder.error,

    updateOrderStatus: updateOrderStatus.mutate,
    updateOrderStatusAsync: updateOrderStatus.mutateAsync,
    isUpdatingStatus: updateOrderStatus.isPending,
    updateStatusError: updateOrderStatus.error,

    updateOrder: updateOrder.mutate,
    updateOrderAsync: updateOrder.mutateAsync,
    isUpdating: updateOrder.isPending,
    updateError: updateOrder.error,

    cancelOrder: cancelOrder.mutate,
    cancelOrderAsync: cancelOrder.mutateAsync,
    isCancelling: cancelOrder.isPending,
    cancelError: cancelOrder.error,
  };
};

