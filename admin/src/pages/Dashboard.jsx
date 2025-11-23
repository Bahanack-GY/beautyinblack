import { motion } from 'framer-motion';
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/Cards/StatCard';
import { useDashboard } from '../hooks';

const Dashboard = () => {
  const {
    stats,
    salesData,
    categoryData,
    recentOrders,
    lowStockProducts,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            Erreur lors du chargement des données: {error.message}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-pink-300 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Bon retour, Admin !</h1>
        <p className="text-pink-50">Voici ce qui se passe dans votre boutique aujourd'hui</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventes totales"
          value={stats?.totalSales ? (typeof stats.totalSales === 'number' ? `${stats.totalSales.toLocaleString()} FCFA` : `${stats.totalSales.toString().replace(/[$,]/g, '')} FCFA`) : '0 FCFA'}
          change={stats?.salesChange || 0}
          icon={DollarSign}
        />
        <StatCard
          title="Commandes"
          value={stats?.totalOrders?.toString() || '0'}
          change={stats?.ordersChange || 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Produits"
          value={stats?.totalProducts?.toString() || '0'}
          change={stats?.productsChange || 0}
          icon={Package}
        />
        <StatCard
          title="Clients"
          value={stats?.totalUsers?.toString() || '0'}
          change={stats?.usersChange || 0}
          icon={Users}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aperçu des ventes</h2>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData || []}>
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
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#f9a8d4" strokeWidth={3} name="Ventes" />
              <Line type="monotone" dataKey="orders" stroke="#9ca3af" strokeWidth={3} name="Commandes" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Répartition par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {(categoryData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Commandes récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">ID Commande</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Produit</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Statut</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Montant</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrders || []).length > 0 ? (
                  recentOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">#{order.id.slice(0, 8)}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{order.customer}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{order.product}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {order.status}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900 dark:text-white">{order.amount}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 px-4 text-center text-gray-500 dark:text-gray-400">
                      Aucune commande récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alerte stock faible</h2>
          </div>
          <div className="space-y-4">
            {(lowStockProducts || []).length > 0 ? (
              lowStockProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{product.name}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Il ne reste que {product.stock} unités
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">Tous les produits ont un stock suffisant</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

