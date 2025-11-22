import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCartPlus } from 'react-icons/fa';

/**
 * Composant ProductCard - Carte produit affichée dans la grille
 * Affiche l'image, le nom, les tailles disponibles, la description et le prix
 * Cliquable pour naviguer vers la page de détails
 */
function ProductCard({ id, name = "HydroSync Pro Water Bottle", description = "Stay on top of your daily water intake with this innovative bottle featuring built-in hydration reminders and Bluetooth connectivity.", price = "137", sizes = ["300 ml", "500 ml"], image = "https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZsZXVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" }) {
    const navigate = useNavigate();
    // Taille sélectionnée par défaut (première taille de la liste)
    const [selectedSize, setSelectedSize] = useState(sizes[0]);

    // Navigation vers la page de détails du produit au clic sur la carte
    const handleCardClick = () => {
        navigate(`/product/${id}`);
    };

    return (
        <motion.div
            onClick={handleCardClick}
            className="relative flex flex-col bg-white rounded-lg overflow-hidden shadow-sm transition-shadow duration-300 group px-3 py-2 cursor-pointer hover:shadow-md"
        >
            {/* Image du produit */}
            <img src={image} alt={name} className="w-full h-32 object-cover border border-gray-100 rounded-xl" />
            
            {/* Nom du produit */}
            <p className="text-lg font-bold text-gray-500">{name}</p>
            
            {/* Sélection de taille - les boutons empêchent la propagation du clic */}
            <div className="flex gap-2">
            {sizes.map((size) => (
                selectedSize === size ? (
                    // Bouton de taille sélectionnée (fond rose)
                    <button 
                        key={size}
                        className="text-xs text-gray-100 rounded-full px-2 py-0.5 bg-[#ffa4a4b7]" 
                        onClick={(e) => {
                            e.stopPropagation(); // Empêcher la navigation au clic
                            setSelectedSize(size);
                        }}
                    >
                        {size}
                    </button>
                ) : (
                    // Bouton de taille non sélectionnée (bordure grise)
                    <button 
                        key={size}
                        className="text-xs text-gray-500 border border-gray-100 rounded-full px-2 py-1" 
                        onClick={(e) => {
                            e.stopPropagation(); // Empêcher la navigation au clic
                            setSelectedSize(size);
                        }}
                    >
                        {size}
                    </button>
                )
            ))}
            </div>
            
            <div className="flex items-center justify-between"></div>
            
            {/* Description du produit (affichée si présente) */}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
            
            {/* Prix et bouton d'ajout au panier */}
            <div className="flex items-center justify-between mt-2">
                 <p className="text-lg font-bold text-gray-500">{price} FCFA</p>
                 {/* Bouton d'ajout au panier - empêche la propagation du clic */}
                 <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={(e) => e.stopPropagation()}
                     className="bg-[#ffa4a4b7] text-white rounded-full p-2"
                 >
                     <FaCartPlus />
                 </motion.button>
            </div>
        </motion.div>
    );
}

export default ProductCard;