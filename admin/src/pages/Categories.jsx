import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../hooks/useCategories';

const Categories = () => {
  const { data, isLoading, isError, error } = useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = data?.categories || [];

  const handleDelete = async (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory.mutate(categoryId, {
        onSuccess: () => {
          alert('Catégorie supprimée avec succès');
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catégories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez les catégories de produits</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors">
          <Plus size={20} />
          Ajouter une catégorie
        </button>
      </div>

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
            {error?.message || 'Impossible de charger les catégories'}
          </p>
        </motion.div>
      )}

      {/* Categories Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                {category.name}
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{category.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Produits</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{category.productsCount}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteCategory.isPending}
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                >
                  {deleteCategory.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

