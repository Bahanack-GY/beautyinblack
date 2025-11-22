import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { BiCheckCircle } from "react-icons/bi";

/**
 * Page ThankYou - Page de confirmation de commande
 * Affiche un message de remerciement après la commande
 */
function ThankYou() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            <Header />
            
            <div className="flex-1 flex items-center justify-center px-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-md"
                >
                    {/* Icône de succès */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-[#B76E79]/10 flex items-center justify-center">
                            <BiCheckCircle size={64} className="text-[#B76E79]" />
                        </div>
                    </motion.div>

                    {/* Message de confirmation */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Merci pour votre commande !
                    </h1>
                    <p className="text-gray-600 mb-2">
                        Votre commande a été reçue avec succès.
                    </p>
                    {orderId && (
                        <p className="text-sm text-gray-500 mb-6">
                            Numéro de commande: <span className="font-semibold">{orderId}</span>
                        </p>
                    )}
                    <p className="text-gray-600 mb-8">
                        Nous traiterons votre commande dans les plus brefs délais. Vous recevrez une notification une fois votre commande expédiée.
                    </p>

                    {/* Boutons d'action */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full bg-gray-100 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Voir mes commandes
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-[#B76E79] text-white py-3 rounded-full font-semibold hover:bg-[#A05A6A] transition-colors shadow-lg"
                        >
                            Continuer mes achats
                        </button>
                    </div>
                </motion.div>
            </div>

            <Navbar />
        </div>
    );
}

export default ThankYou;

