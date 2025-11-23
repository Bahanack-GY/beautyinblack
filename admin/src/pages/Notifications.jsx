import { motion } from 'framer-motion';
import { Bell, Package, ShoppingCart, AlertCircle, CheckCircle, Info, Loader2, Trash2 } from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../hooks/useNotifications';

const Notifications = () => {
  const { data, isLoading, isError, error } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = (notificationId) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (notificationId) => {
    if (window.confirm('Supprimer cette notification ?')) {
      deleteNotification.mutate(notificationId);
    }
  };

  // Fonction utilitaire pour formater le temps relatif
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  // Fonction utilitaire pour obtenir l'icône et la couleur selon le type
  const getNotificationStyle = (type) => {
    const styles = {
      order: {
        icon: ShoppingCart,
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      },
      stock: {
        icon: AlertCircle,
        color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
      },
      product: {
        icon: Package,
        color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
      },
      system: {
        icon: Info,
        color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      },
      success: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      },
      default: {
        icon: Bell,
        color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
      }
    };
    return styles[type] || styles.default;
  };

  // Transformer les données backend au format UI
  const notifications = (data?.notifications || []).map((notification) => {
    const style = getNotificationStyle(notification.type);
    return {
      ...notification,
      icon: style.icon,
      color: style.color,
      time: formatRelativeTime(notification.createdAt),
    };
  });

  const unreadCount = data?.unreadCount || notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Restez informé des activités de votre boutique</p>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          disabled={markAllAsRead.isPending || unreadCount === 0}
          className="px-6 py-3 bg-pink-300 text-white rounded-lg hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {markAllAsRead.isPending ? 'Chargement...' : 'Tout marquer comme lu'}
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
            {error?.message || 'Impossible de charger les notifications'}
          </p>
        </motion.div>
      )}

      {/* Notifications List */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 dark:text-gray-400">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification, index) => {
                const Icon = notification.icon || Bell;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notification.read ? 'bg-pink-50/50 dark:bg-pink-900/10' : ''
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`w-12 h-12 rounded-xl ${notification.color || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={20} />
                      </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 bg-pink-300 rounded-full inline-block" />
                          )}
                        </h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                        title="Marquer comme lu"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Notifications;

