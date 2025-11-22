import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

/**
 * Hook personnalisé pour obtenir les commandes de l'utilisateur
 */
export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
    enabled: !!localStorage.getItem('token'), // Récupérer uniquement si authentifié
    select: (data) => data.orders || [],
  });
};

/**
 * Hook personnalisé pour obtenir une commande par ID
 */
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderById(orderId),
    enabled: !!orderId && !!localStorage.getItem('token'),
  });
};

/**
 * Hook personnalisé pour créer une nouvelle commande
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

