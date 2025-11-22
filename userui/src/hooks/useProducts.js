import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';

/**
 * Custom hook to get all products with optional filters
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
    select: (data) => data.products || [],
  });
};

/**
 * Custom hook to get product by ID
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Custom hook to get best selling products
 */
export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productsApi.getBestSellers(),
    select: (data) => data.products || [],
  });
};

/**
 * Custom hook to get products by category
 */
export const useProductsByCategory = (categoryName, params = {}) => {
  return useQuery({
    queryKey: ['products', 'category', categoryName, params],
    queryFn: () => productsApi.getByCategory(categoryName, params),
    enabled: !!categoryName,
    select: (data) => data.products || [],
  });
};

/**
 * Custom hook to search products
 */
export const useSearchProducts = (searchParams) => {
  return useQuery({
    queryKey: ['products', 'search', searchParams],
    queryFn: () => productsApi.search(searchParams),
    enabled: !!searchParams?.q,
    select: (data) => data.products || [],
  });
};

