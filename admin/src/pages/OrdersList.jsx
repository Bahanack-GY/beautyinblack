import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, Package, Truck, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useOrders, useOrderStats } from '../hooks/useOrders';
import { ordersApi } from '../api/ordersApi';

const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Récupérer les commandes avec filtres
  // Note : Le backend ne supporte pas encore la recherche, donc on filtre côté client
  const { data, isLoading, isError, error } = useOrders({
    page,
    limit,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    // paramètre de recherche pas encore supporté par le backend
  });

  // Récupérer les statistiques de commandes
  const { data: statsData } = useOrderStats();

  const statuses = ['all', 'en_cours', 'livraison', 'livre', 'cancelled'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'livre':
      case 'delivered': 
        return <CheckCircle size={18} />;
      case 'en_cours':
      case 'processing':
      case 'pending': 
        return <Package size={18} />;
      case 'livraison':
      case 'shipped': 
        return <Truck size={18} />;
      case 'cancelled': 
        return <XCircle size={18} />;
      default: 
        return <Package size={18} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'all': 'Tous les statuts',
      'en_cours': 'En cours',
      'livraison': 'En livraison',
      'livre': 'Livré',
      'cancelled': 'Annulé',
      'pending': 'En attente',
      'processing': 'En traitement',
      'shipped': 'Expédié',
      'delivered': 'Livré'
    };
    return labels[status] || status;
  };

  // Filtrer les commandes côté client si un terme de recherche est fourni (recherche backend pas encore implémentée)
  let orders = data?.orders || [];
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    orders = orders.filter(order => {
      const orderId = order.id?.toLowerCase() || '';
      const customerName = (order.customer?.name || order.user?.name || '').toLowerCase();
      const customerEmail = (order.customer?.email || order.user?.email || '').toLowerCase();
      return orderId.includes(searchLower) || 
             customerName.includes(searchLower) || 
             customerEmail.includes(searchLower);
    });
  }
  
  const totalPages = data?.totalPages || 1;

  // Utiliser les statistiques de l'API backend, repli sur les statistiques calculées si non disponibles
  const stats = statsData || {
    total: data?.total || orders.length,
    pending: orders.filter(o => o.status === 'en_cours' || o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'en_cours' || o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'livraison' || o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'livre' || o.status === 'delivered').length,
  };

  // Gérer l'export des commandes
  const handleExportOrders = async () => {
    try {
      // Si le endpoint d'export n'est pas disponible, créer un CSV à partir des données actuelles
      if (!orders || orders.length === 0) {
        alert('Aucune commande à exporter');
        return;
      }

      // Créer le contenu CSV
      const headers = ['ID', 'Client', 'Email', 'Date', 'Statut', 'Total (FCFA)', 'Articles', 'Méthode de paiement'];
      const rows = orders.map(order => [
        order.id || '',
        order.customer?.name || order.user?.name || 'N/A',
        order.customer?.email || order.user?.email || 'N/A',
        order.date ? new Date(order.date).toLocaleDateString('fr-FR') : 'N/A',
        getStatusLabel(order.status),
        typeof order.total === 'number' ? order.total.toLocaleString('fr-FR') : (order.total || 0).toLocaleString('fr-FR'),
        Array.isArray(order.items) ? order.items.length : (typeof order.items === 'number' ? order.items : 0),
        order.paymentMethod || order.payment || 'N/A'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Ajouter BOM pour compatibilité UTF-8 Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Créer le lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'exportation des commandes: ' + (error?.message || 'Erreur inconnue'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Commandes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez et suivez toutes les commandes</p>
        </div>
        <button 
          onClick={handleExportOrders}
          className="flex items-center gap-2 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors"
        >
          <Download size={20} />
          Exporter les commandes
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total commandes', value: stats.total },
          { label: 'En attente', value: stats.pending },
          { label: 'En traitement', value: stats.processing },
          { label: 'Expédiées', value: stats.shipped },
          { label: 'Livrées', value: stats.delivered },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-300" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
          </motion.div>
        ))}
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
              placeholder="Rechercher des commandes par ID, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
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
            {error?.message || 'Impossible de charger les commandes'}
          </p>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aucune commande trouvée
          </p>
        </motion.div>
      )}

      {/* Orders Table */}
      {!isLoading && !isError && orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">ID Commande</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Client</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Date</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Articles</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Total</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Statut</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Paiement</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900 dark:text-white">{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.customer?.name || order.user?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer?.email || order.user?.email || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {order.date ? new Date(order.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {Array.isArray(order.items) ? order.items.length : (typeof order.items === 'number' ? order.items : 0)} articles
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {typeof order.total === 'number' ? order.total.toLocaleString('fr-FR') : (order.total || 0).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'livre' || order.status === 'delivered' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : order.status === 'livraison' || order.status === 'shipped'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : order.status === 'en_cours' || order.status === 'processing' || order.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : order.status === 'cancelled' || order.status === 'annule'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    }`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {order.paymentMethod === 'OM' ? 'Orange Money' : 
                     order.paymentMethod === 'MOMO' ? 'MTN Mobile Money' :
                     order.payment === 'paid' ? 'Payé' : 
                     order.payment === 'pending' ? 'En attente' : 
                     order.payment === 'refunded' ? 'Remboursé' : 
                     order.paymentMethod || order.payment || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors text-sm"
                    >
                      <Eye size={16} />
                      Voir
                    </Link>
                  </td>
                </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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

export default OrdersList;

