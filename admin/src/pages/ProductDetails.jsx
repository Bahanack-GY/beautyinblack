import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Package,
  TrendingUp, 
  ShoppingCart, 
  DollarSign,
  Star,
  BarChart3,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useProduct, useProductAnalytics } from '../hooks/useProducts';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const { data: analytics, isLoading: isLoadingAnalytics, isError: isAnalyticsError, error: analyticsError } = useProductAnalytics(id);
  
  // Journaliser l'erreur d'analytics pour le débogage
  if (isAnalyticsError) {
    console.warn('Erreur de chargement des analytics:', analyticsError);
  }

  // Ne pas bloquer sur le chargement des analytics - afficher le produit même si les analytics échouent
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin text-pink-300 mx-auto mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  // Utiliser les données d'analytics réelles ou fournir des valeurs par défaut
  // Les analytics sont optionnels - ne pas bloquer le rendu de la page s'ils échouent
  const salesData = analytics?.salesData || [];
  const sizeDistribution = analytics?.sizeDistribution || [];
  const totalSales = analytics?.totalSales || 0;
  const totalRevenue = analytics?.totalRevenue || 0;
  const averageRating = analytics?.averageRating || product?.rating || 4.5;
  const growth = analytics?.growth || 0;
  
  const isAnalyticsLoading = isLoadingAnalytics && !analytics;

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 dark:text-red-400">
            {error?.message || 'Produit introuvable'}
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const price = product.priceNumber || product.price || 0;
  const displayPrice = typeof price === 'number' ? (price / 100).toLocaleString('fr-FR') : price;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {product.category} • ID: {product.id}
            </p>
          </div>
        </div>
        <Link
          to={`/products/${product.id}/edit`}
          className="flex items-center gap-2 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
        >
          <Edit size={20} />
          Modifier le produit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Informations du produit</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Nom</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{product.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Catégorie</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{product.category}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Prix</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{displayPrice} FCFA</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Stock</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{product.stock || 0} unités</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white mt-1">{product.description || 'Aucune description'}</p>
              </div>
              {product.sizes && product.sizes.length > 0 && (
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Tailles disponibles</label>
                  <div className="flex gap-2 mt-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.skinTypes && product.skinTypes.length > 0 && (
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Types de peau</label>
                  <div className="flex gap-2 mt-2">
                    {product.skinTypes.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-sm text-pink-700 dark:text-pink-400 capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sales Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Évolution des ventes</h2>
              <BarChart3 className="text-pink-300" size={24} />
            </div>
            {isAnalyticsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="animate-spin text-pink-300" size={32} />
              </div>
            ) : salesData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                <p>Aucune donnée de vente disponible</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Revenus (FCFA)') {
                      return `${Number(value).toLocaleString('fr-FR')} FCFA`;
                    }
                    return value;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#f9a8d4" strokeWidth={3} name="Ventes (unités)" />
                <Line type="monotone" dataKey="revenue" stroke="#9ca3af" strokeWidth={3} name="Revenus (FCFA)" />
              </LineChart>
            </ResponsiveContainer>
            )}
          </motion.div>

          {/* Size Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Répartition par taille</h2>
            {isAnalyticsLoading ? (
              <div className="flex items-center justify-center h-[250px]">
                <Loader2 className="animate-spin text-pink-300" size={32} />
              </div>
            ) : sizeDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
                <p>Aucune donnée de taille disponible</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sizeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="size" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Legend />
                <Bar dataKey="sales" fill="#f9a8d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Image du produit</h2>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=Image+non+disponible';
                }}
              />
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Métriques clés</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="text-pink-300" size={20} />
                  <span className="text-gray-600 dark:text-gray-400">Ventes totales</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{totalSales.toLocaleString('fr-FR')}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="text-green-500" size={20} />
                  <span className="text-gray-600 dark:text-gray-400">Revenus totaux</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{totalRevenue.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="text-yellow-500" size={20} />
                  <span className="text-gray-600 dark:text-gray-400">Note moyenne</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-500" size={20} />
                  <span className="text-gray-600 dark:text-gray-400">Croissance</span>
                </div>
                <span className={`font-bold ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Link
                to={`/products/${product.id}/edit`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
              >
                <Edit size={18} />
                Modifier le produit
              </Link>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Package size={18} />
                Gérer le stock
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

