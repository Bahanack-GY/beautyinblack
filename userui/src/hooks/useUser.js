import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

/**
 * Hook personnalisé pour obtenir le profil utilisateur
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userApi.getProfile(),
    enabled: !!localStorage.getItem('token'), // Récupérer uniquement si authentifié
  });
};

/**
 * Hook personnalisé pour mettre à jour le profil utilisateur
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Hook personnalisé pour obtenir les adresses de l'utilisateur
 */
export const useAddresses = () => {
  return useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: () => userApi.getAddresses(),
    enabled: !!localStorage.getItem('token'), // Récupérer uniquement si authentifié
    select: (data) => data.addresses || [],
  });
};

/**
 * Hook personnalisé pour ajouter une adresse
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

/**
 * Hook personnalisé pour mettre à jour une adresse
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, data }) => userApi.updateAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

/**
 * Hook personnalisé pour supprimer une adresse
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });
};

