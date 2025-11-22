import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi';

/**
 * Hook personnalisé pour obtenir les notifications de l'utilisateur
 */
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    enabled: !!localStorage.getItem('token'), // Récupérer uniquement si authentifié
    select: (data) => ({
      notifications: data.notifications || [],
      unreadCount: data.unreadCount || 0,
    }),
  });
};

/**
 * Hook personnalisé pour marquer une notification comme lue
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook personnalisé pour marquer toutes les notifications comme lues
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

