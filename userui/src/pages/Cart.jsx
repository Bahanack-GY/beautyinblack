import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { BiTrash, BiPlus, BiMinus } from "react-icons/bi";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "../hooks";

/**
 * Page Cart - Gestion du panier d'achat
 * Affiche tous les articles du panier avec possibilité de modifier les quantités et supprimer des articles
 */
function Cart() {
    const navigate = useNavigate();
    const { data: cartData, isLoading } = useCart();
    const updateCartItem = useUpdateCartItem();
    const removeFromCart = useRemoveFromCart();

    const cartItems = cartData?.items || [];
    const subtotal = cartData?.subtotal || 0;
    const shipping = cartData?.shipping || 5000;
    const total = cartData?.total || (subtotal + shipping);

    // Fonction pour modifier la quantité d'un article (augmenter ou diminuer)
    const handleUpdateQuantity = (itemId, currentQuantity, change) => {
        const newQuantity = Math.max(1, currentQuantity + change);
        updateCartItem.mutate({
            itemId,
            data: { quantity: newQuantity }
        });
    };

    // Fonction pour supprimer un article du panier
    const handleRemoveItem = (itemId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            removeFromCart.mutate(itemId);
        }
    };

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            <Header />
            
            {/* En-tête de la page */}
            <div className="pt-20 px-5 pb-5">
                <h1 className="text-3xl font-bold text-black">Mon Panier</h1>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 px-5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : cartItems.length === 0 ? (
                    // Message affiché quand le panier est vide
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-600 mb-2">Votre panier est vide</p>
                            <p className="text-sm text-gray-400">Ajoutez des parfums à votre panier</p>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Liste des articles du panier */}
                        <div className="space-y-0">
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-start py-4 border-b border-gray-200">
                                        {/* Image du produit */}
                                        <div className="flex-shrink-0 mr-4">
                                            <img 
                                                src={item.image || "https://via.placeholder.com/80"} 
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Informations du produit */}
                                        <div className="flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-black mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-400 mb-2">{item.size}</p>
                                            <p className="text-base font-semibold text-black mb-3">
                                                {item.price?.toLocaleString() || 0} FCFA
                                            </p>
                                            
                                            {/* Contrôles de quantité */}
                                            <div className="flex items-center gap-3 mb-3">
                                                {/* Bouton pour diminuer la quantité */}
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                                    disabled={updateCartItem.isPending}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#B76E79] hover:text-[#B76E79] transition-colors disabled:opacity-50"
                                                >
                                                    <BiMinus size={16} />
                                                </button>
                                                {/* Affichage de la quantité */}
                                                <span className="text-base font-semibold text-black w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                {/* Bouton pour augmenter la quantité */}
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                                    disabled={updateCartItem.isPending}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#B76E79] hover:text-[#B76E79] transition-colors disabled:opacity-50"
                                                >
                                                    <BiPlus size={16} />
                                                </button>
                                                {/* Bouton pour supprimer l'article */}
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={removeFromCart.isPending}
                                                    className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                                >
                                                    <BiTrash size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Résumé de la commande avec totaux */}
                        <div className="pt-6 pb-4">
                            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                                {/* Sous-total */}
                                <div className="flex justify-between text-gray-600">
                                    <span>Sous-total</span>
                                    <span className="font-semibold">{subtotal.toLocaleString()} FCFA</span>
                                </div>
                                {/* Frais de livraison */}
                                <div className="flex justify-between text-gray-600">
                                    <span>Livraison</span>
                                    <span className="font-semibold">{shipping.toLocaleString()} FCFA</span>
                                </div>
                                {/* Total général */}
                                <div className="border-t border-gray-300 pt-3 flex justify-between">
                                    <span className="text-lg font-bold text-black">Total</span>
                                    <span className="text-lg font-bold text-[#B76E79]">{total.toLocaleString()} FCFA</span>
                                </div>
                                {/* Bouton pour passer la commande */}
                                <button 
                                    onClick={() => {
                                        const token = localStorage.getItem('token');
                                        if (!token) {
                                            navigate('/auth');
                                        } else {
                                            navigate('/checkout');
                                        }
                                    }}
                                    className="w-full mt-4 bg-[#B76E79] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#A05A6A] transition-colors shadow-lg"
                                >
                                    Passer la commande
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Navbar />
        </div>
    );
}

export default Cart;
