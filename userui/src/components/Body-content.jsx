import { useState } from "react";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./Product-card";

/**
 * Composant BodyContent - Contenu principal de la page d'accueil
 * Gère la recherche, le filtrage par catégorie et l'affichage des produits
 */
function BodyContent(){
    // État pour la recherche textuelle
    const [searchQuery, setSearchQuery] = useState("");
    // État pour la catégorie sélectionnée (par défaut "Tout")
    const [selectedCategory, setSelectedCategory] = useState("Tout");
    // État pour afficher/masquer les filtres de catégories
    const [showFilters, setShowFilters] = useState(false);

    // Données des produits parfums - Dans une vraie app, ceci viendrait d'une API
    const products = [
        { 
            id: 1, 
            name: "Black Velvet", 
            description: "Parfum féminin élégant aux notes de rose et vanille", 
            price: "85,000", 
            category: "Femme",
            sizes: ["30 ml", "50 ml"],
            image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
        },
        { 
            id: 2, 
            name: "Midnight Essence", 
            description: "Fragrance masculine intense aux notes boisées et épicées", 
            price: "92,000", 
            category: "Homme",
            sizes: ["50 ml", "100 ml"],
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
        },
        { 
            id: 3, 
            name: "Vanilla Dreams", 
            description: "Parfum gourmand chaleureux aux notes de vanille et caramel", 
            price: "78,000", 
            category: "Femme",
            sizes: ["30 ml", "50 ml"],
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
        },
        { 
            id: 4, 
            name: "Ocean Breeze", 
            description: "Eau de parfum fraîche aux notes d'agrumes et de menthe", 
            price: "65,000", 
            category: "Enfant",
            sizes: ["50 ml", "100 ml"],
            image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500"
        },
       
        { 
            id: 6, 
            name: "Dark Wood", 
            description: "Fragrance masculine boisée aux notes de cèdre et patchouli", 
            price: "95,000", 
            category: "Homme",
            sizes: ["50 ml", "100 ml"],
            image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
        },
        { 
            id: 7, 
            name: "Amber Mystique", 
            description: "Parfum oriental sensuel aux notes d'ambre et musc", 
            price: "98,000", 
            category: "Femme",
            sizes: ["30 ml", "50 ml"],
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
        },
       
    ];

    // Catégories disponibles pour le filtrage
    const categories = ["Tout", "Homme", "Femme", "Enfant"];

    // Filtrage des produits selon la recherche et la catégorie sélectionnée
    const filteredProducts = products.filter(product => {
        // Recherche dans le nom et la description (insensible à la casse)
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        // Vérifie si la catégorie correspond (ou si "Tout" est sélectionné)
        const matchesCategory = selectedCategory === "Tout" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Gestion de la soumission du formulaire de recherche
    const handleSearch = (e) => {
        e.preventDefault();
    };

    return(
        <div className="flex flex-col bg-[#FAF9F6] min-h-screen w-full">
            {/* Section de recherche */}
            <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSearch}
            >
                <div className="w-full px-5 gap-3 flex pt-5 pb-3">
                    {/* Champ de recherche avec icône */}
                    <div className="relative w-full">
                        <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input
                            className="w-full rounded-full pl-12 pr-4 py-3 border-2 border-gray-200 text-black focus:border-[#B76E79] focus:outline-none transition-all duration-300 shadow-xs"
                            placeholder="Rechercher un parfum..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Bouton pour afficher/masquer les filtres */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 rounded-full transition-all duration-300 ${
                            showFilters ? 'bg-[#B76E79] text-white' : 'bg-gray-200'
                        }`}
                    >
                        <HiAdjustmentsVertical size={28} />
                    </motion.button>
                </div>
            </motion.form>

            {/* Section des catégories - apparaît/disparaît avec animation */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="flex justify-evenly px-5 pb-3">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                                        selectedCategory === category
                                            ? 'bg-[#B76E79] text-white scale-105'
                                            : 'bg-white text-[#B76E79] border-2 border-[#B76E79]'
                                    }`}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section d'affichage des produits en grille */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 gap-2 px-4 py-5"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            layout
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                sizes={product.sizes}
                                image={product.image}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Message affiché quand aucun produit n'est trouvé */}
            {filteredProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10 text-gray-500"
                >
                    <p className="text-lg font-semibold">Aucun parfum trouvé</p>
                    <p className="text-sm">Essayez une autre recherche ou catégorie</p>
                </motion.div>
            )}
        </div>
    )
}

export default BodyContent