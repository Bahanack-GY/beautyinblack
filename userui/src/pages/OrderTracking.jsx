import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { BiArrowBack, BiCheck } from "react-icons/bi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useOrder } from "../hooks";

/**
 * Page OrderTracking - Suivi de commande
 * Affiche le statut de la commande avec progression: Commande passée → En cours de traitement → Livraison en cours → Livré
 */
function OrderTracking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: order, isLoading } = useOrder(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Commande non trouvée</div>
            </div>
        );
    }

    // Utiliser les étapes de suivi de l'API si disponibles, sinon utiliser les valeurs par défaut
    const trackingSteps = order.trackingSteps || [
        {
            id: "commande_passee",
            label: "Commande passée",
            description: "Votre commande a été confirmée"
        },
        {
            id: "en_cours_traitement",
            label: "En cours de traitement",
            description: "Votre commande est en préparation"
        },
        {
            id: "livraison_cours",
            label: "Livraison en cours",
            description: "Votre commande est en route"
        },
        {
            id: "livre",
            label: "Livré",
            description: "Votre commande a été livrée"
        }
    ];

    // Déterminer l'étape actuelle basée sur le statut
    const getCurrentStepIndex = () => {
        if (order.trackingSteps) {
            return order.trackingSteps.findIndex(step => step.completed === false);
        }
        switch (order.status) {
            case "en_cours":
                return 1; // En cours de traitement
            case "livraison":
                return 2; // Livraison en cours
            case "livre":
                return 3; // Livré
            default:
                return 0; // Commande passée
        }
    };

    const currentStepIndex = getCurrentStepIndex() >= 0 ? getCurrentStepIndex() : trackingSteps.length - 1;

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
                    <h1 className="flex-1 text-center text-xl font-semibold text-black mr-6">
                        Suivi de commande
                    </h1>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 px-5">
                {/* Informations de la commande */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Commande #{order.id}</p>
                        <p className="text-xs text-gray-400">{order.date || new Date(order.createdAt || Date.now()).toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>

                {/* Timeline de suivi */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Statut de la commande</h2>
                    <div className="relative">
                        {/* Ligne verticale */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200">
                            <div 
                                className="absolute top-0 left-0 w-full bg-[#B76E79] transition-all duration-500"
                                style={{ height: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {/* Étapes */}
                        <div className="space-y-6">
                            {trackingSteps.map((step, index) => {
                                const isCompleted = step.completed !== undefined ? step.completed : index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative flex items-start gap-4"
                                    >
                                        {/* Cercle indicateur */}
                                        <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                            isCompleted
                                                ? "bg-[#B76E79] border-[#B76E79]"
                                                : "bg-white border-gray-300"
                                        }`}>
                                            {isCompleted && (
                                                <BiCheck size={20} className="text-white" />
                                            )}
                                        </div>

                                        {/* Contenu de l'étape */}
                                        <div className="flex-1 pt-1">
                                            <h3 className={`text-base font-semibold mb-1 ${
                                                isCompleted ? "text-gray-900" : "text-gray-400"
                                            }`}>
                                                {step.label}
                                            </h3>
                                            <p className={`text-sm ${
                                                isCompleted ? "text-gray-600" : "text-gray-400"
                                            }`}>
                                                {step.description}
                                            </p>
                                            {isCurrent && order.status === "livraison" && (
                                                <p className="text-xs text-[#B76E79] mt-1 font-medium">
                                                    Livreur en route vers votre adresse
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Détails de la commande */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Articles commandés</h2>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 bg-gray-50 rounded-xl p-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">{item.size}</p>
                                    <p className="text-sm text-gray-400 mb-2">
                                        Quantité: {item.quantity}
                                    </p>
                                    <p className="text-base font-bold text-[#B76E79]">
                                        {(item.price * item.quantity).toLocaleString()} FCFA
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Adresse de livraison */}
                {order.address && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Adresse de livraison</h2>
                        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                            <HiOutlineLocationMarker size={20} className="text-[#B76E79] mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                                {order.address.fullAddress || order.address.street || JSON.stringify(order.address)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Résumé de la commande */}
                <div className="bg-gray-50 rounded-2xl p-5">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Résumé</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Sous-total</span>
                            <span>{(order.subtotal || (order.total - (order.shipping || 5000))).toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Livraison</span>
                            <span>{(order.shipping || 5000).toLocaleString()} FCFA</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 flex justify-between mt-3">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-[#B76E79]">
                                {order.total.toLocaleString()} FCFA
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Navbar />
        </div>
    );
}

export default OrderTracking;

