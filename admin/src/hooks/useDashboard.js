import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';

/**
 * Hook personnalisé pour les données du tableau de bord
 * Récupère et gère les statistiques du tableau de bord
 */

export const useDashboard = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Actualisation automatique toutes les 5 minutes
  });

  return {
    stats: data?.stats || null,
    salesData: data?.salesData || [],
    categoryData: data?.categoryData || [],
    recentOrders: data?.recentOrders || [],
    lowStockProducts: data?.lowStockProducts || [],
    isLoading,
    error,
    refetch,
  };
};


