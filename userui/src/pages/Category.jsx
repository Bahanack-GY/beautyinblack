import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ProductCard from "../components/Product-card";
import { BiArrowBack, BiX } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { HiAdjustmentsVertical } from "react-icons/hi2";
import { useProductsByCategory } from "../hooks";

/**
 * Page Category - Affiche les produits d'une catégorie spécifique
 * Affiche un popup pour sélectionner le type de peau au chargement
 */
function Category() {
    const navigate = useNavigate();
    const { categoryName } = useParams();
    
    const [showSkinTypePopup, setShowSkinTypePopup] = useState(true);
    const [selectedSkinType, setSelectedSkinType] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Récupérer les produits par catégorie depuis l'API
    const { data: apiProducts = [], isLoading, isSuccess } = useProductsByCategory(
        categoryName,
        { 
            skinType: selectedSkinType || undefined,
            search: searchQuery || undefined
        }
    );

    // Données des produits par catégorie et type de peau - Repli uniquement si l'API échoue
    const categoryProducts = {
        homme: {
            sèche: [
                { 
                    id: 2, 
                    name: "Midnight Essence", 
                    description: "Fragrance hydratante pour peau sèche aux notes boisées", 
                    price: "92,000", 
                    category: "Homme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                },
                { 
                    id: 6, 
                    name: "Dark Wood", 
                    description: "Parfum nourrissant aux notes de cèdre et patchouli", 
                    price: "95,000", 
                    category: "Homme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                }
            ],
            grasse: [
                { 
                    id: 8, 
                    name: "Urban Gentleman", 
                    description: "Fragrance légère et fraîche pour peau grasse", 
                    price: "88,000", 
                    category: "Homme",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                },
                { 
                    id: 2, 
                    name: "Midnight Essence", 
                    description: "Fragrance masculine intense aux notes boisées et épicées", 
                    price: "92,000", 
                    category: "Homme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            mixte: [
                { 
                    id: 6, 
                    name: "Dark Wood", 
                    description: "Fragrance équilibrée pour peau mixte", 
                    price: "95,000", 
                    category: "Homme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                },
                { 
                    id: 8, 
                    name: "Urban Gentleman", 
                    description: "Parfum moderne aux notes fraîches et élégantes", 
                    price: "88,000", 
                    category: "Homme",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            sensible: [
                { 
                    id: 8, 
                    name: "Urban Gentleman", 
                    description: "Fragrance douce et hypoallergénique", 
                    price: "88,000", 
                    category: "Homme",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            normale: [
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
                    id: 6, 
                    name: "Dark Wood", 
                    description: "Fragrance masculine boisée aux notes de cèdre et patchouli", 
                    price: "95,000", 
                    category: "Homme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"
                },
                { 
                    id: 8, 
                    name: "Urban Gentleman", 
                    description: "Parfum moderne aux notes fraîches et élégantes", 
                    price: "88,000", 
                    category: "Homme",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ]
        },
        femme: {
            sèche: [
                { 
                    id: 1, 
                    name: "Black Velvet", 
                    description: "Parfum hydratant aux notes de rose et vanille", 
                    price: "85,000", 
                    category: "Femme",
                    sizes: ["30 ml", "50 ml"],
                    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
                },
                { 
                    id: 3, 
                    name: "Vanilla Dreams", 
                    description: "Parfum nourrissant aux notes de vanille et caramel", 
                    price: "78,000", 
                    category: "Femme",
                    sizes: ["30 ml", "50 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            grasse: [
                { 
                    id: 9, 
                    name: "Rose Elegance", 
                    description: "Fragrance légère et fraîche pour peau grasse", 
                    price: "88,000", 
                    category: "Femme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                },
                { 
                    id: 1, 
                    name: "Black Velvet", 
                    description: "Parfum féminin élégant aux notes de rose et vanille", 
                    price: "85,000", 
                    category: "Femme",
                    sizes: ["30 ml", "50 ml"],
                    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
                }
            ],
            mixte: [
                { 
                    id: 7, 
                    name: "Amber Mystique", 
                    description: "Parfum équilibré pour peau mixte", 
                    price: "98,000", 
                    category: "Femme",
                    sizes: ["30 ml", "50 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                },
                { 
                    id: 9, 
                    name: "Rose Elegance", 
                    description: "Fragrance florale délicate aux notes de rose et jasmin", 
                    price: "88,000", 
                    category: "Femme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                }
            ],
            sensible: [
                { 
                    id: 9, 
                    name: "Rose Elegance", 
                    description: "Fragrance douce et hypoallergénique", 
                    price: "88,000", 
                    category: "Femme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                },
                { 
                    id: 1, 
                    name: "Black Velvet", 
                    description: "Parfum doux aux notes de rose et vanille", 
                    price: "85,000", 
                    category: "Femme",
                    sizes: ["30 ml", "50 ml"],
                    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500"
                }
            ],
            normale: [
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
                    id: 3, 
                    name: "Vanilla Dreams", 
                    description: "Parfum gourmand chaleureux aux notes de vanille et caramel", 
                    price: "78,000", 
                    category: "Femme",
                    sizes: ["30 ml", "50 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
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
                { 
                    id: 9, 
                    name: "Rose Elegance", 
                    description: "Fragrance florale délicate aux notes de rose et jasmin", 
                    price: "88,000", 
                    category: "Femme",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                }
            ]
        },
        enfants: {
            sèche: [
                { 
                    id: 4, 
                    name: "Ocean Breeze", 
                    description: "Eau de parfum hydratante pour enfants", 
                    price: "65,000", 
                    category: "Enfant",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500"
                }
            ],
            grasse: [
                { 
                    id: 10, 
                    name: "Sweet Dreams", 
                    description: "Parfum frais et léger pour enfants", 
                    price: "60,000", 
                    category: "Enfant",
                    sizes: ["50 ml"],
                    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500"
                }
            ],
            mixte: [
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
                    id: 10, 
                    name: "Sweet Dreams", 
                    description: "Parfum doux et fruité pour enfants", 
                    price: "60,000", 
                    category: "Enfant",
                    sizes: ["50 ml"],
                    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500"
                }
            ],
            sensible: [
                { 
                    id: 10, 
                    name: "Sweet Dreams", 
                    description: "Parfum doux et hypoallergénique pour enfants", 
                    price: "60,000", 
                    category: "Enfant",
                    sizes: ["50 ml"],
                    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500"
                }
            ],
            normale: [
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
                    id: 10, 
                    name: "Sweet Dreams", 
                    description: "Parfum doux et fruité pour enfants", 
                    price: "60,000", 
                    category: "Enfant",
                    sizes: ["50 ml"],
                    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500"
                }
            ]
        },
        mixte: {
            sèche: [
                { 
                    id: 11, 
                    name: "Universal Essence", 
                    description: "Fragrance hydratante unisexe", 
                    price: "90,000", 
                    category: "Mixte",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                }
            ],
            grasse: [
                { 
                    id: 12, 
                    name: "Neutral Harmony", 
                    description: "Fragrance légère et fraîche unisexe", 
                    price: "85,000", 
                    category: "Mixte",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            mixte: [
                { 
                    id: 11, 
                    name: "Universal Essence", 
                    description: "Fragrance unisexe aux notes fraîches et modernes", 
                    price: "90,000", 
                    category: "Mixte",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                },
                { 
                    id: 12, 
                    name: "Neutral Harmony", 
                    description: "Parfum équilibré adapté à tous", 
                    price: "85,000", 
                    category: "Mixte",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            sensible: [
                { 
                    id: 12, 
                    name: "Neutral Harmony", 
                    description: "Fragrance douce et hypoallergénique", 
                    price: "85,000", 
                    category: "Mixte",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ],
            normale: [
                { 
                    id: 11, 
                    name: "Universal Essence", 
                    description: "Fragrance unisexe aux notes fraîches et modernes", 
                    price: "90,000", 
                    category: "Mixte",
                    sizes: ["30 ml", "50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1595425970377-c970029944a6?w=500"
                },
                { 
                    id: 12, 
                    name: "Neutral Harmony", 
                    description: "Parfum équilibré adapté à tous", 
                    price: "85,000", 
                    category: "Mixte",
                    sizes: ["50 ml", "100 ml"],
                    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500"
                }
            ]
        }
    };

    // Types de peau disponibles
    const skinTypes = [
        { id: "sèche", label: "Peau sèche", icon: "💧" },
        { id: "grasse", label: "Peau grasse", icon: "✨" },
        { id: "mixte", label: "Peau mixte", icon: "🌊" },
        { id: "sensible", label: "Peau sensible", icon: "🌿" },
        { id: "normale", label: "Peau normale", icon: "🌟" }
    ];

    // Obtenir les produits selon la catégorie et le type de peau sélectionné
    const getProducts = () => {
        // Toujours utiliser les produits de l'API si la requête a réussi (même si tableau vide)
        // Repli sur les données codées en dur uniquement si la requête API n'a pas encore réussi
        if (isSuccess) {
            return apiProducts;
        }
        
        // Repli sur les données codées en dur uniquement si l'API n'a pas réussi
        // Cela ne devrait se produire que lors du chargement initial ou si l'API est indisponible
        if (!selectedSkinType) {
            return [];
        }
        const categoryData = categoryProducts[categoryName];
        if (!categoryData) return [];
        return categoryData[selectedSkinType] || [];
    };

    // Obtenir les produits - L'API a la priorité
    const allProducts = getProducts();
    
    // Filtrage de recherche côté client (uniquement si pas déjà filtré par l'API)
    // Note : L'API gère la recherche, mais on garde le côté client comme sauvegarde
    const filteredProducts = allProducts.filter(product => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) ||
               product.description?.toLowerCase().includes(query);
    });

    const products = filteredProducts;
    const categoryDisplayName = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "";
    
    // Obtenir le label du type de peau sélectionné
    const selectedSkinTypeLabel = skinTypes.find(st => st.id === selectedSkinType)?.label || "";

    const handleSkinTypeSelect = (skinType) => {
        setSelectedSkinType(skinType);
        // Fermer le popup après sélection
        setTimeout(() => {
            setShowSkinTypePopup(false);
        }, 300);
    };

    const handleClosePopup = () => {
        setShowSkinTypePopup(false);
    };

    const handleOpenSkinTypeFilter = () => {
        setShowSkinTypePopup(true);
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
                    <h1 className="flex-1 text-center text-2xl font-bold text-black mr-6">
                        {categoryDisplayName}
                    </h1>
                </div>

                {/* Barre de recherche et filtre */}
                {selectedSkinType && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 mb-4"
                    >
                        {/* Champ de recherche */}
                        <div className="relative flex-1">
                            <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                className="w-full rounded-full pl-12 pr-4 py-3 border-2 border-gray-200 text-black focus:border-[#B76E79] focus:outline-none transition-all duration-300 shadow-sm"
                                placeholder="Rechercher un parfum..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Bouton filtre type de peau */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOpenSkinTypeFilter}
                            className="p-3 rounded-full bg-[#B76E79] text-white hover:bg-[#A05A6A] transition-colors shadow-sm"
                            title="Changer le type de peau"
                        >
                            <HiAdjustmentsVertical size={24} />
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Contenu principal */}
            <div className="flex-1 px-5">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Chargement...</div>
                    </div>
                ) : !selectedSkinType && !isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-600 mb-2">Sélectionnez votre type de peau</p>
                            <p className="text-sm text-gray-400">Choisissez votre type de peau pour voir nos recommandations</p>
                        </div>
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center py-20"
                    >
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-600 mb-2">
                                {searchQuery ? "Aucun produit trouvé" : "Aucun produit disponible"}
                            </p>
                            <p className="text-sm text-gray-400">
                                {searchQuery 
                                    ? `Aucun résultat pour "${searchQuery}"` 
                                    : `Aucune recommandation pour ${selectedSkinTypeLabel}`
                                }
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Message de recommandation basé sur le type de peau */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-[#B76E79]/10 rounded-xl"
                        >
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-[#B76E79]">Recommandations pour {selectedSkinTypeLabel}:</span>
                                {" "}Découvrez nos parfums spécialement adaptés à votre type de peau
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-2">
                            {products.map((product, index) => (
                                <motion.div
                                    key={`${product.id}-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
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
                        </div>
                    </>
                )}
            </div>

            {/* Popup pour sélectionner le type de peau */}
            <AnimatePresence>
                {showSkinTypePopup && (
                    <>
                        {/* Overlay avec effet de flou */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClosePopup}
                            className="fixed inset-0 bg-white/30 backdrop-blur-md z-50"
                        />
                        
                        {/* Popup modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 p-6 max-w-md mx-auto"
                        >
                            {/* Bouton fermer */}
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <BiX size={24} />
                            </button>

                            {/* Titre */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center pr-8">
                                Sélectionner votre type de peau
                            </h2>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                Choisissez votre type de peau pour des recommandations personnalisées
                            </p>

                            {/* Liste des types de peau */}
                            <div className="space-y-3">
                                {skinTypes.map((skinType) => (
                                    <motion.button
                                        key={skinType.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSkinTypeSelect(skinType.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                            selectedSkinType === skinType.id
                                                ? 'border-[#B76E79] bg-[#B76E79]/10'
                                                : 'border-gray-200 hover:border-[#B76E79]/50'
                                        }`}
                                    >
                                        <span className="text-2xl">{skinType.icon}</span>
                                        <span className={`flex-1 text-left font-semibold ${
                                            selectedSkinType === skinType.id
                                                ? 'text-[#B76E79]'
                                                : 'text-gray-700'
                                        }`}>
                                            {skinType.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Navbar />
        </div>
    );
}

export default Category;

