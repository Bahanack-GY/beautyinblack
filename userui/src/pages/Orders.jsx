import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { BiArrowBack, BiChevronRight } from "react-icons/bi";
import { useOrders } from "../hooks";

/**
 * Page Orders - Liste des commandes de l'utilisateur
 * Affiche les commandes en cours et les commandes reçues
 */
function Orders() {
    const navigate = useNavigate();
    const { data: orders = [], isLoading } = useOrders();

    // Séparer les commandes en cours et reçues
    const ongoingOrders = orders.filter(order => order.status !== "livre");
    const receivedOrders = orders.filter(order => order.status === "livre");

    const handleOrderClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            <Header />
            
            {/* En-tête de la page avec bouton retour */}
            <div className="pt-20 px-5 pb-5">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-gray-800 p-2 -ml-2"
                    >
                        <BiArrowBack size={24} />
                    </button>
                    <h1 className="flex-1 text-center text-3xl font-bold text-black mr-6">
                        Mes commandes
                    </h1>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 px-5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : orders.length === 0 ? (
                    // Message affiché quand il n'y a pas de commandes
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-600 mb-2">Aucune commande</p>
                            <p className="text-sm text-gray-400">Vous n'avez pas encore passé de commande</p>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Section Commandes en cours */}
                        {ongoingOrders.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">En cours</h2>
                                <div className="space-y-4">
                                    {ongoingOrders.map((order, index) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <button
                                                onClick={() => handleOrderClick(order.id)}
                                                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-[#B76E79] transition-colors text-left"
                                            >
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-400 mb-1">Commande #{order.id}</p>
                                                    <p className="text-xs text-gray-400">{order.date}</p>
                                                </div>
                                                
                                                {/* Aperçu des produits */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex -space-x-2">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                                                            />
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-gray-600">+{order.items.length - 3}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">
                                                            {order.items.length} {order.items.length > 1 ? 'articles' : 'article'}
                                                        </p>
                                                    </div>
                                                    <BiChevronRight size={20} className="text-gray-400" />
                                                </div>
                                                
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <span className="text-sm text-gray-600">Total</span>
                                                    <span className="text-lg font-bold text-[#B76E79]">
                                                        {order.total.toLocaleString()} FCFA
                                                    </span>
                                                </div>
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section Commandes reçues */}
                        {receivedOrders.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Reçues</h2>
                                <div className="space-y-4">
                                    {receivedOrders.map((order, index) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (ongoingOrders.length + index) * 0.1 }}
                                        >
                                            <button
                                                onClick={() => handleOrderClick(order.id)}
                                                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-[#B76E79] transition-colors text-left"
                                            >
                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-400 mb-1">Commande #{order.id}</p>
                                                    <p className="text-xs text-gray-400">{order.date}</p>
                                                </div>
                                                
                                                {/* Aperçu des produits */}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex -space-x-2">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                                                            />
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-gray-600">+{order.items.length - 3}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">
                                                            {order.items.length} {order.items.length > 1 ? 'articles' : 'article'}
                                                        </p>
                                                    </div>
                                                    <BiChevronRight size={20} className="text-gray-400" />
                                                </div>
                                                
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                    <span className="text-sm text-gray-600">Total</span>
                                                    <span className="text-lg font-bold text-[#B76E79]">
                                                        {order.total.toLocaleString()} FCFA
                                                    </span>
                                                </div>
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Navbar />
        </div>
    );
}

export default Orders;

