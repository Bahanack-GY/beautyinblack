import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ProductCard from "../components/Product-card";
import { useProducts, useCategories } from "../hooks";

/**
 * Page Découvrir - Page de découverte des collections
 * Affiche les produits et catégories disponibles
 */
function Decouvrir() {
    const navigate = useNavigate();
    const { data: products = [], isLoading: isLoadingProducts } = useProducts({ limit: 8 });
    const { data: categories = [] } = useCategories();

    const handleCategoryClick = (categorySlug) => {
        navigate(`/category/${categorySlug}`);
    };

    return (
        <div className="flex flex-col bg-[#FAF9F6] min-h-screen w-screen pb-32">
            <Header />
            
            <div className="pt-20 px-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-[#B76E79] mb-4">Découvrir</h1>
                    <p className="text-gray-600 text-lg">Explorez nos collections et nouveautés</p>
                </motion.div>

                {/* Catégories */}
                {categories.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos Catégories</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.slug || category.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCategoryClick(category.slug || category.name.toLowerCase())}
                                    className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100"
                                >
                                    <div className="relative h-32">
                                        <img 
                                            src={category.image || "https://via.placeholder.com/200"} 
                                            alt={category.name || category.slug}
                                            className="w-full h-full object-cover"
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
                    </div>
                )}

                {/* Produits */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tous les produits</h2>
                    {isLoadingProducts ? (
                        <div className="text-center py-8 text-gray-500">Chargement...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Aucun produit disponible</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
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
            </div>
            
            <Navbar />
        </div>
    );
}

export default Decouvrir;
