import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';

/**
 * Hook personnalisé pour les opérations sur les utilisateurs
 */

// Clés de requête
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  profile: () => [...userKeys.all, 'profile'],
  addresses: (id) => [...userKeys.all, 'addresses', id],
  stats: () => [...userKeys.all, 'stats'],
};

/**
 * Hook to get all users with filters
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
    keepPreviousData: true,
  });
};

/**
 * Hook to get single user by ID
 */
export const useUser = (userId) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to get user profile
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: usersApi.getUserProfile,
  });
};

/**
 * Hook to get user statistics
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: usersApi.getUserStats,
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

/**
 * Hook to update user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => usersApi.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to get user addresses
 */
export const useUserAddresses = (userId = null) => {
  return useQuery({
    queryKey: userKeys.addresses(userId),
    queryFn: () => usersApi.getUserAddresses(userId),
  });
};

/**
 * Hook to add user address
 */
export const useAddUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.addUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses(null) });
    },
  });
};

/**
 * Hook to update user address
 */
export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, data }) => usersApi.updateUserAddress(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses(null) });
    },
  });
};

/**
 * Hook to delete user address
 */
export const useDeleteUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.deleteUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses(null) });
    },
  });
};

