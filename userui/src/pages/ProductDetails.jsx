import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiChevronLeft, BiChevronDown } from "react-icons/bi";
import { BiBookmark, BiBookmarkHeart } from "react-icons/bi";
import { CiShoppingBasket } from "react-icons/ci";
import { BiStar } from "react-icons/bi";
import { useProduct, useAddToCart, useCart, useFavorites, useAddFavorite, useRemoveFavorite } from "../hooks";
import logo from "../assets/Logo.png";

/**
 * Page ProductDetails - Détails d'un produit
 * Affiche toutes les informations d'un parfum avec possibilité de sélectionner une taille
 * et d'ajouter le produit au panier
 */
function ProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID du produit depuis l'URL
    const [selectedSize, setSelectedSize] = useState(null);
    const [expandedSection, setExpandedSection] = useState(null); // Section développée (description ou livraison)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Récupérer les données du produit
    const { data: product, isLoading: isLoadingProduct } = useProduct(id);
    const { data: cartData } = useCart();
    const { data: favorites = [] } = useFavorites();
    const addToCartMutation = useAddToCart();
    const addFavoriteMutation = useAddFavorite();
    const removeFavoriteMutation = useRemoveFavorite();

    // Vérifier si le produit est dans les favoris
    const isFavorite = favorites.some(fav => fav.productId?.toString() === id || fav.productId === id);

    // Calculer le nombre d'articles dans le panier
    const cartCount = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Fonction pour développer/réduire une section (description ou livraison)
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Fonction pour ajouter un produit au panier
    const handleAddToCart = () => {
        // Vérification qu'une taille est sélectionnée
        if (!selectedSize) {
            alert("Veuillez sélectionner une taille");
            return;
        }

        // Vérifier si l'utilisateur est authentifié
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        addToCartMutation.mutate({
            productId: id.toString(),
            size: selectedSize,
            quantity: 1
        }, {
            onSuccess: () => {
                alert("Produit ajouté au panier");
            },
            onError: (error) => {
                alert(error.message || "Erreur lors de l'ajout au panier");
            }
        });
    };

    // Fonction pour basculer le favori
    const handleToggleFavorite = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        if (isFavorite) {
            removeFavoriteMutation.mutate(id);
        } else {
            addFavoriteMutation.mutate({ productId: id.toString() });
        }
    };

    if (isLoadingProduct) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Produit non trouvé</div>
            </div>
        );
    }

    const productImages = product.images || (product.image ? [product.image] : []);

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-20">
            {/* Navigation en haut avec bouton retour, logo et panier */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-5 py-3 border-b border-gray-200">
                <button onClick={() => navigate(-1)} className="text-gray-800">
                    <BiChevronLeft size={28} />
                </button>
                <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
                {/* Bouton panier avec badge de notification */}
                <button onClick={() => navigate('/cart')} className="text-gray-800 relative">
                    <CiShoppingBasket size={28} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="pt-16">
                {/* Section image du produit avec carrousel */}
                <div className="relative w-full">
                    <img 
                        src={productImages[currentImageIndex] || product.image || "https://via.placeholder.com/500"} 
                        alt={product.name}
                        className="w-full h-96 object-cover"
                    />
                    
                    {/* Indicateurs du carrousel d'images */}
                    {productImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {productImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1 rounded-full transition-all cursor-pointer ${
                                        index === currentImageIndex 
                                            ? 'bg-[#B76E79] w-6' 
                                            : 'bg-gray-300 w-1'
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Informations du produit */}
                <div className="px-5 py-4 bg-white">
                    <p className="text-sm text-gray-400 mb-2">{product.category}</p>
                    <div className="flex items-start justify-between mb-3">
                        <h1 className="text-2xl font-bold text-gray-900 flex-1">{product.name}</h1>
                        {/* Note du produit avec étoile */}
                        {product.rating && (
                            <div className="flex items-center gap-1 ml-4">
                                <BiStar className="text-[#B76E79]" size={20} />
                                <span className="text-sm text-gray-400">({product.rating})</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xl font-bold text-gray-900">{product.price} FCFA</p>

                    {/* Sélection de taille */}
                    <div className="mt-6 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-base font-semibold text-gray-900">Taille:</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {(product.sizes || []).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                        selectedSize === size
                                            ? 'bg-[#B76E79] text-white border-[#B76E79]'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#B76E79]'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sections pliables (Description et Livraison) */}
                    <div className="mt-4 space-y-2">
                        {/* Section Description */}
                        <button
                            onClick={() => toggleSection('description')}
                            className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                        >
                            <span className="text-base font-semibold text-gray-900">Description</span>
                            <BiChevronDown 
                                size={24} 
                                className={`text-gray-600 transition-transform ${
                                    expandedSection === 'description' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {expandedSection === 'description' && (
                            <div className="px-2 py-3 text-sm text-gray-600">
                                {product.description}
                            </div>
                        )}

                        {/* Section Livraison et Retours */}
                        <button
                            onClick={() => toggleSection('delivery')}
                            className="w-full flex items-center justify-between py-3 border-b border-gray-200"
                        >
                            <span className="text-base font-semibold text-gray-900">Livraison et Retours</span>
                            <BiChevronDown 
                                size={24} 
                                className={`text-gray-600 transition-transform ${
                                    expandedSection === 'delivery' ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        {expandedSection === 'delivery' && (
                            <div className="px-2 py-3 text-sm text-gray-600">
                                {product.deliveryInfo || "Livraison gratuite sur toutes les commandes. Retours acceptés sous 30 jours."}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Barre d'actions fixe en bas */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-5 py-4 flex items-center gap-4">
                {/* Bouton favori avec changement d'icône selon l'état */}
                <button
                    onClick={handleToggleFavorite}
                    disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isFavorite 
                            ? 'bg-[#B76E79] border-[#B76E79] text-white' 
                            : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                >
                    {isFavorite ? <BiBookmarkHeart size={24} /> : <BiBookmark size={24} />}
                </button>
                {/* Bouton principal d'ajout au panier */}
                <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    className="flex-1 bg-[#B76E79] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#A05A6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {addToCartMutation.isPending ? 'Ajout...' : 'Ajouter au panier'}
                </button>
            </div>
        </div>
    );
}

export default ProductDetails;
