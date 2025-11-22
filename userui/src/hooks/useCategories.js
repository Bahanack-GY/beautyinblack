import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categoriesApi';

/**
 * Custom hook to get all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    select: (data) => data.categories || [],
  });
};

