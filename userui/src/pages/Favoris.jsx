import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

/**
 * Page Favoris - Liste de souhaits (Wish List)
 * Affiche tous les parfums ajoutés aux favoris avec possibilité de les ajouter au panier
 */
function Favoris() {
    // Données des parfums favoris - Dans une vraie app, ceci viendrait d'un état/context
    const favorites = [
        {
            id: 1,
            name: "Black Velvet",
            price: "85,000",
            details: "Catégorie: Femme | Taille: 50 ml",
            image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
        },
        {
            id: 5,
            name: "Rose Elegance",
            price: "88,000",
            details: "Catégorie: Femme | Taille: 100 ml",
            image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
        },
        {
            id: 3,
            name: "Vanilla Dreams",
            price: "78,000",
            details: "Catégorie: Femme | Taille: 50 ml",
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
        },
        {
            id: 7,
            name: "Amber Mystique",
            price: "98,000",
            details: "Catégorie: Femme | Taille: 30 ml",
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
        }
    ];

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            <Header />
            
            {/* En-tête de la page */}
            <div className="pt-20 px-5 pb-5">
                <h1 className="text-3xl font-bold text-black">Wish List</h1>
            </div>

            {/* Liste des favoris */}
            <div className="flex-1 px-5">
                {favorites.length === 0 ? (
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
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-start py-4 border-b border-gray-200">
                                    {/* Image du produit */}
                                    <div className="flex-shrink-0 mr-4">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Informations du produit */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-black mb-1">{item.name}</h3>
                                        <p className="text-base text-black mb-1">{item.price} FCFA</p>
                                        <p className="text-sm text-gray-400 mb-3">{item.details}</p>
                                        
                                        {/* Bouton pour ajouter au panier */}
                                        <button className="w-fit px-6 py-2 border-2 border-black rounded-full text-sm font-medium text-black hover:bg-black hover:text-white transition-all duration-300">
                                            Move to Bag
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
