import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useFavorites, useMoveFavoriteToCart } from "../hooks";

/**
 * Page Favoris - Liste de souhaits (Wish List)
 * Affiche tous les parfums ajoutés aux favoris avec possibilité de les ajouter au panier
 */
function Favoris() {
    const navigate = useNavigate();
    const { data: favorites = [], isLoading } = useFavorites();
    const moveToCart = useMoveFavoriteToCart();
    const [selectedSizes, setSelectedSizes] = useState({});

    const handleMoveToCart = (productId) => {
        const size = selectedSizes[productId];
        if (!size) {
            alert("Veuillez sélectionner une taille");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        moveToCart.mutate({
            productId: productId.toString(),
            data: { size, quantity: 1 }
        }, {
            onSuccess: () => {
                alert("Produit ajouté au panier");
            }
        });
    };

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            <Header />
            
            {/* En-tête de la page */}
            <div className="pt-20 px-5 pb-5">
                <h1 className="text-3xl font-bold text-black">Wish List</h1>
            </div>

            {/* Liste des favoris */}
            <div className="flex-1 px-5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : favorites.length === 0 ? (
                    // Message affiché quand la liste est vide
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-600 mb-2">Votre liste de souhaits est vide</p>
                            <p className="text-sm text-gray-400">Ajoutez des parfums à vos favoris</p>
                        </div>
                    </motion.div>
                ) : (
                    // Liste des produits favoris
                    <div className="space-y-0">
                        {favorites.map((item, index) => (
                            <motion.div
                                key={item.id || item.productId}
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
                                        <p className="text-base text-black mb-1">{item.price} FCFA</p>
                                        <p className="text-sm text-gray-400 mb-2">
                                            {item.details || `Catégorie: ${item.category || 'N/A'} | Taille: ${item.size || 'N/A'}`}
                                        </p>
                                        
                                        {/* Sélection de taille si disponible */}
                                        {item.size && (
                                            <div className="mb-2">
                                                <select
                                                    value={selectedSizes[item.productId || item.id] || ''}
                                                    onChange={(e) => setSelectedSizes({
                                                        ...selectedSizes,
                                                        [item.productId || item.id]: e.target.value
                                                    })}
                                                    className="text-sm border border-gray-300 rounded px-2 py-1 mb-2"
                                                >
                                                    <option value="">Sélectionner une taille</option>
                                                    {item.size && <option value={item.size}>{item.size}</option>}
                                                </select>
                                            </div>
                                        )}
                                        
                                        {/* Bouton pour ajouter au panier */}
                                        <button 
                                            onClick={() => handleMoveToCart((item.productId || item.id).toString())}
                                            disabled={moveToCart.isPending}
                                            className="w-fit px-6 py-2 border-2 border-black rounded-full text-sm font-medium text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50"
                                        >
                                            {moveToCart.isPending ? 'Ajout...' : 'Move to Bag'}
                                        </button>
                                    </div>
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

export default Favoris;
