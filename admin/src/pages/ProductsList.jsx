import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';

const ProductsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Récupérer les produits avec filtres
  const { data, isLoading, isError, error } = useProducts({
    page,
    limit,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchTerm || undefined,
  });

  // Mutation de suppression
  const deleteProduct = useDeleteProduct();

  const categories = ['all', 'Homme', 'Femme', 'Enfants', 'Mixte'];

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(productId, {
        onSuccess: () => {
          alert('Produit supprimé avec succès');
        },
        onError: (error) => {
          alert('Erreur lors de la suppression: ' + (error?.message || 'Erreur inconnue'));
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Produits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez votre inventaire de produits</p>
        </div>
        <Link
          to="/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
        >
          <Plus size={20} />
          Ajouter un produit
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Toutes les catégories' : cat}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter size={20} />
              Plus de filtres
            </button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-pink-300" size={48} />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
        >
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 dark:text-red-400">
            {error?.message || 'Impossible de charger les produits'}
          </p>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aucun produit trouvé
          </p>
        </motion.div>
      )}

      {/* Products Grid */}
      {!isLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.category}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.stock} en stock
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.sizes.map(size => (
                  <span
                    key={size}
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    {size}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(product.priceNumber || product.price || 0).toLocaleString()} FCFA
                </span>
                <div className="flex gap-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteProduct.isPending}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteProduct.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-2"
        >
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === pageNum
                    ? 'bg-pink-300 text-white'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductsList;

