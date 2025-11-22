import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cartApi';

/**
 * Hook personnalisé pour obtenir le panier de l'utilisateur
 */
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: !!localStorage.getItem('token'), // Récupérer uniquement si authentifié
  });
};

/**
 * Hook personnalisé pour ajouter un article au panier
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

/**
 * Hook personnalisé pour mettre à jour la quantité d'un article du panier
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }) => cartApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

/**
 * Hook personnalisé pour retirer un article du panier
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

/**
 * Hook personnalisé pour finaliser le panier
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

