import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "../hooks";
import { BiCheck, BiCheckCircle } from "react-icons/bi";

/**
 * Page Notifications - Gestion des notifications utilisateur
 * Affiche toutes les notifications de l'utilisateur
 */
function Notifications() {
    const { data: notificationsData, isLoading } = useNotifications();
    const markAsRead = useMarkNotificationAsRead();
    const markAllAsRead = useMarkAllNotificationsAsRead();
    
    const notifications = notificationsData?.notifications || [];
    const unreadCount = notificationsData?.unreadCount || 0;

    const handleMarkAsRead = (notificationId) => {
        markAsRead.mutate(notificationId);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate();
    };

    return (
        <div className="flex flex-col bg-[#FAF9F6] min-h-screen w-screen pb-32">
            <Header />
            
            {/* En-tête */}
            <div className="pt-20 px-5 pb-5">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-black">Notifications</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={markAllAsRead.isPending}
                            className="text-sm text-[#B76E79] font-semibold hover:underline disabled:opacity-50"
                        >
                            {markAllAsRead.isPending ? 'Marquage...' : 'Tout marquer comme lu'}
                        </button>
                    )}
                </div>
                {unreadCount > 0 && (
                    <p className="text-sm text-gray-600">{unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}</p>
                )}
            </div>

            {/* Liste des notifications */}
            <div className="flex-1 px-5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : notifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-600 mb-2">Aucune notification</p>
                            <p className="text-sm text-gray-400">Vous n'avez pas de notifications</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-xl p-4 border-l-4 ${
                                    notification.read 
                                        ? 'border-gray-300' 
                                        : 'border-[#B76E79]'
                                } shadow-sm`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-base font-semibold ${
                                                notification.read ? 'text-gray-700' : 'text-gray-900'
                                            }`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 rounded-full bg-[#B76E79]"></span>
                                            )}
                                        </div>
                                        <p className={`text-sm mb-2 ${
                                            notification.read ? 'text-gray-500' : 'text-gray-700'
                                        }`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            disabled={markAsRead.isPending}
                                            className="ml-4 p-2 text-[#B76E79] hover:bg-[#B76E79]/10 rounded-full transition-colors disabled:opacity-50"
                                            title="Marquer comme lu"
                                        >
                                            <BiCheckCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            
            <Navbar />
        </div>
    );
}

export default Notifications;
