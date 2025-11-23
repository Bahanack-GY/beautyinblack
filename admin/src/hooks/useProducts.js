import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';

/**
 * Hook personnalisé pour les opérations sur les produits
 * Fournit les opérations CRUD pour les produits avec React Query
 */

// Clés de requête
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
  bestSellers: () => [...productKeys.all, 'best-sellers'],
  search: (query) => [...productKeys.all, 'search', query],
  category: (categoryName) => [...productKeys.all, 'category', categoryName],
};

/**
 * Hook to get all products with pagination and filters
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
    keepPreviousData: true,
  });
};

/**
 * Hook to get single product by ID
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get best selling products
 */
export const useBestSellers = (limit = 4) => {
  return useQuery({
    queryKey: productKeys.bestSellers(),
    queryFn: () => productsApi.getBestSellers(limit),
  });
};

/**
 * Hook to search products
 */
export const useProductSearch = (query, filters = {}) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productsApi.searchProducts(query, filters),
    enabled: !!query && query.length > 0,
  });
};

/**
 * Hook to get products by category
 */
export const useProductsByCategory = (categoryName, filters = {}) => {
  return useQuery({
    queryKey: productKeys.category(categoryName),
    queryFn: () => productsApi.getProductsByCategory(categoryName, filters),
    enabled: !!categoryName,
  });
};

/**
 * Hook to get product analytics
 */
export const useProductAnalytics = (productId) => {
  return useQuery({
    queryKey: [...productKeys.detail(productId), 'analytics'],
    queryFn: () => productsApi.getProductAnalytics(productId),
    enabled: !!productId,
  });
};

/**
 * Hook to create a product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      // Invalider et récupérer la liste des produits
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to update a product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productsApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      // Invalider le produit spécifique et la liste des produits
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      // Invalider la liste des produits
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to bulk update products
 */
export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.bulkUpdateProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Hook to bulk delete products
 */
export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.bulkDeleteProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

/**
 * Combined hook for all product operations
 */
export const useProductOperations = () => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const bulkUpdate = useBulkUpdateProducts();
  const bulkDelete = useBulkDeleteProducts();

  return {
    createProduct: createProduct.mutate,
    createProductAsync: createProduct.mutateAsync,
    isCreating: createProduct.isPending,
    createError: createProduct.error,

    updateProduct: updateProduct.mutate,
    updateProductAsync: updateProduct.mutateAsync,
    isUpdating: updateProduct.isPending,
    updateError: updateProduct.error,

    deleteProduct: deleteProduct.mutate,
    deleteProductAsync: deleteProduct.mutateAsync,
    isDeleting: deleteProduct.isPending,
    deleteError: deleteProduct.error,

    bulkUpdate: bulkUpdate.mutate,
    isBulkUpdating: bulkUpdate.isPending,
    bulkUpdateError: bulkUpdate.error,

    bulkDelete: bulkDelete.mutate,
    isBulkDeleting: bulkDelete.isPending,
    bulkDeleteError: bulkDelete.error,
  };
};

