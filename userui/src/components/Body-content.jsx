import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBestSellers, useCategories } from "../hooks";
import ProductCard from "./Product-card";

/**
 * Composant BodyContent - Contenu principal de la page d'accueil
 * Gère la recherche, le filtrage par catégorie et l'affichage des produits
 */
function BodyContent(){
    const navigate = useNavigate();
    const { data: bestSellers = [], isLoading: isLoadingBestSellers } = useBestSellers();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

    const handleCategoryClick = (categoryName) => {
        // Normaliser le nom de catégorie au format slug
        const categorySlug = categoryName.toLowerCase();
        // Gérer les formes singulières et plurielles
        const slugMap = {
            'homme': 'homme',
            'femme': 'femmes',
            'femmes': 'femmes',
            'enfant': 'enfants',
            'enfants': 'enfants',
            'mixte': 'mixte'
        };
        const normalizedSlug = slugMap[categorySlug] || categorySlug;
        navigate(`/category/${normalizedSlug}`);
    };

    return(
        <div className="flex flex-col bg-[#FAF9F6] min-h-screen w-full">
            {/* Section Best Sellers */}
            <div className="px-5 pt-5 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Sellers</h2>
                {isLoadingBestSellers ? (
                    <div className="text-center py-8 text-gray-500">Chargement...</div>
                ) : bestSellers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Aucun produit disponible</div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {bestSellers.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    description={product.description}
                                    price={product.price}
                                    sizes={product.sizes || []}
                                    image={product.image}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Section Catégories */}
            <div className="px-5 pt-6 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Catégories</h2>
                {isLoadingCategories ? (
                    <div className="text-center py-8 text-gray-500">Chargement...</div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Aucune catégorie disponible</div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.name || category.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCategoryClick(category.name || category.slug)}
                                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100"
                            >
                                <div className="relative h-32">
                                    <img 
                                        src={category.image || "https://images.unsplash.com/photo-1585144374720-64d181405b1c?w=500"} 
                                        alt={category.name || category.slug}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                                        <span className="text-white text-xl font-bold drop-shadow-lg">
                                            {category.name || category.slug}
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BodyContent