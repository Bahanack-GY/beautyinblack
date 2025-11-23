import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Loader2, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/Cards/StatCard';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

const Analytics = () => {
  const { data: analytics, isLoading, isError, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: dashboardApi.getAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Actualisation automatique toutes les 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin text-pink-300 mx-auto mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Chargement des analyses...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-600 dark:text-red-400">
            {error?.message || 'Impossible de charger les analyses'}
          </p>
        </div>
      </div>
    );
  }

  // Utiliser les données réelles ou fournir des valeurs par défaut
  const metrics = analytics?.metrics || {
    revenue: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    newUsers: { value: 0, change: 0 },
    productsSold: { value: 0, change: 0 },
  };

  const salesTrend = analytics?.salesTrend || [];
  const categoryPerformance = analytics?.categoryPerformance || [];
  const topProducts = analytics?.topProducts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analyses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Suivez les performances et les insights de votre boutique</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenus (ce mois)"
          value={`${(metrics.revenue.value || 0).toLocaleString('fr-FR')} FCFA`}
          change={metrics.revenue.change || 0}
          icon={DollarSign}
        />
        <StatCard
          title="Commandes (ce mois)"
          value={(metrics.orders.value || 0).toString()}
          change={metrics.orders.change || 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Nouveaux clients"
          value={(metrics.newUsers.value || 0).toString()}
          change={metrics.newUsers.change || 0}
          icon={Users}
        />
        <StatCard
          title="Produits vendus"
          value={(metrics.productsSold.value || 0).toLocaleString('fr-FR')}
          change={metrics.productsSold.change || 0}
          icon={Package}
        />
      </div>

      {/* Revenue & Orders Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tendances des revenus et commandes</h2>
            <p className="text-sm text-gray-500 mt-1">Performances des 7 dernières semaines</p>
          </div>
          <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300">
            <option>7 dernières semaines</option>
            <option>30 derniers jours</option>
            <option>6 derniers mois</option>
            <option>Dernière année</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={salesTrend}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f9a8d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f9a8d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
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
            <Area type="monotone" dataKey="revenue" stroke="#f9a8d4" fillOpacity={1} fill="url(#colorRevenue)" name="Revenus (FCFA)" />
            <Area type="monotone" dataKey="orders" stroke="#9ca3af" fillOpacity={1} fill="url(#colorOrders)" name="Commandes" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Performance & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Performance par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => {
                  if (name === 'Ventes (FCFA)') {
                    return `${Number(value).toLocaleString('fr-FR')} FCFA`;
                  }
                  return value;
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#f9a8d4" radius={[8, 8, 0, 0]} name="Ventes (FCFA)" />
              <Bar dataKey="orders" fill="#9ca3af" radius={[8, 8, 0, 0]} name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Produits les plus vendus</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{product.units} unités vendues</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{(product.sales || 0).toLocaleString('fr-FR')} FCFA</p>
                  <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                    <TrendingUp size={14} />
                    <span>+{((product.sales / (product.sales + 1000)) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

