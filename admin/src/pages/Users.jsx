import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Trash2, Download, User, Loader2, AlertCircle } from 'lucide-react';
import { useUsers, useDeleteUser } from '../hooks/useUsers';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembership, setSelectedMembership] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useUsers({
    page,
    limit,
    search: searchTerm || undefined,
  });

  const deleteUser = useDeleteUser();
  
  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser.mutate(userId, {
        onSuccess: () => {
          alert('Utilisateur supprimé avec succès');
        },
        onError: (error) => {
          alert('Erreur lors de la suppression: ' + (error?.message || 'Erreur inconnue'));
        },
      });
    }
  };

  const memberships = ['all', 'Premium', 'Regular'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez les comptes clients</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors">
          <Download size={20} />
          Exporter les utilisateurs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total utilisateurs', value: users.length },
          { label: 'Membres Premium', value: users.filter(u => u.membership === 'Premium').length },
          { label: 'Membres réguliers', value: users.filter(u => u.membership === 'Regular').length },
          { label: 'Utilisateurs actifs', value: users.filter(u => u.status === 'active').length },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
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
              placeholder="Rechercher des utilisateurs par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedMembership}
              onChange={(e) => setSelectedMembership(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {memberships.map(membership => (
                <option key={membership} value={membership}>
                  {membership === 'all' ? 'Tous les abonnements' : membership === 'Premium' ? 'Premium' : 'Régulier'}
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

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Utilisateur</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Contact</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Abonnement</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Inscrit le</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Commandes</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Total dépensé</th>
                <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center text-white">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {user.phone}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {user.membership}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {user.orders}
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {(user.totalSpent || 0).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteUser.isPending}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                    >
                      {deleteUser.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                    </div>
                  </td>
                </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Users;

