import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';

/**
 * Hook personnalisé pour obtenir les favoris de l'utilisateur
 */
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getFavorites(),
    enabled: !!localStorage.getItem('token'), // Récupérer uniquement si authentifié
    select: (data) => data.favorites || [],
  });
};

/**
 * Hook personnalisé pour ajouter un produit aux favoris
 */
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritesApi.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

/**
 * Hook personnalisé pour retirer un produit des favoris
 */
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoritesApi.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

/**
 * Hook personnalisé pour déplacer un favori vers le panier
 */
export const useMoveFavoriteToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data }) => favoritesApi.moveToCart(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

