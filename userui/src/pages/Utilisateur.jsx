import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddressModal from "../components/AddressModal";
import { 
    BiHeart, 
    BiChevronRight, 
    BiArrowBack,
    BiEnvelope,
    BiPhone,
    BiStar,
    BiUser,
    BiEdit,
    BiTrash,
    BiPlus
} from "react-icons/bi";
import { 
    HiOutlineLocationMarker,
    HiOutlineMail
} from "react-icons/hi";
import { 
    FaWhatsapp,
    FaShoppingBag
} from "react-icons/fa";
import { useUserProfile, useAddresses, useFavorites, useDeleteAddress } from "../hooks";

/**
 * Page Utilisateur - Profil utilisateur avec informations et menu de navigation
 * Affiche les informations personnelles, coordonnées et liens vers les autres sections
 */
function Utilisateur() {
    const navigate = useNavigate();
    const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();
    const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses();
    const { data: favorites = [] } = useFavorites();
    const deleteAddressMutation = useDeleteAddress();
    
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
    const favoritesCount = favorites.length;

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressModal(true);
    };

    const handleAddAddress = () => {
        setEditingAddress(null);
        setShowAddressModal(true);
    };

    const handleDeleteAddress = (addressId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) {
            deleteAddressMutation.mutate(addressId);
        }
    };

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            {/* En-tête rose avec photo de profil et informations */}
            <div className="bg-[#B76E79] pt-12 pb-8 px-5 rounded-b-3xl">
                {/* Barre d'en-tête avec flèche retour et titre */}
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-white p-2 -ml-2"
                    >
                        <BiArrowBack size={24} />
                    </button>
                    <h1 className="flex-1 text-center text-xl font-semibold text-white mr-6">
                        Profil Utilisateur
                    </h1>
                </div>

                {/* Photo de profil circulaire */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <img 
                            src={userProfile?.profileImage || "https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZsZXVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"} 
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                </div>

                {/* Nom d'utilisateur et titre */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {isLoadingProfile ? 'Chargement...' : (userProfile?.name || 'Utilisateur')}
                    </h2>
                    <p className="text-white/90 text-sm">
                        {userProfile?.membershipType === 'premium' ? 'Client Premium' : 'Client Standard'}
                    </p>
                </div>

                {/* Icônes d'action de contact (Email, Téléphone, WhatsApp, Favori) */}
                <div className="flex justify-center items-center gap-6">
                    <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <BiEnvelope size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <BiPhone size={20} />
                    </button>
                    {/* Séparateur vertical */}
                    <div className="w-px h-8 bg-white/30"></div>
                    <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <FaWhatsapp size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <BiStar size={20} />
                    </button>
                </div>
            </div>

            {/* Section de contenu blanc avec les différentes options */}
            <div className="flex-1 px-5 pt-6">
                {/* Section Email */}
                <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-3">Email</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <HiOutlineMail size={20} className="text-[#B76E79]" />
                            <div className="flex-1">
                                <span className="text-sm text-gray-400 mr-2">Officiel</span>
                                <span className="text-sm text-gray-800">
                                    {isLoadingProfile ? 'Chargement...' : (userProfile?.email || 'Non renseigné')}
                                </span>
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* Section Numéro de téléphone */}
                <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-3">Numéro de téléphone</h3>
                    <div className="flex items-center gap-3">
                        <BiPhone size={20} className="text-[#B76E79]" />
                        <span className="text-sm text-gray-800">
                            {isLoadingProfile ? 'Chargement...' : (userProfile?.phone || 'Non renseigné')}
                        </span>
                    </div>
                </div>

                {/* Section Modifier mon profil - Bouton cliquable */}
                <div className="mb-6">
                    <button 
                        onClick={() => console.log("Modifier mon profil")}
                        className="w-full flex items-center justify-between py-2"
                    >
                        <div className="flex items-center gap-3">
                            <BiUser size={20} className="text-[#B76E79]" />
                            <div className="text-left">
                                <h3 className="text-base font-bold text-gray-800 mb-1">Modifier mon profil</h3>
                                <p className="text-sm text-gray-600">Gérer vos informations personnelles</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#B76E79]/10 flex items-center justify-center">
                            <BiChevronRight size={20} className="text-[#B76E79]" />
                        </div>
                    </button>
                </div>

                {/* Section Mes commandes - Bouton cliquable */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/orders')}
                        className="w-full flex items-center justify-between py-2"
                    >
                        <div className="flex items-center gap-3">
                            <FaShoppingBag size={20} className="text-[#B76E79]" />
                            <div className="text-left">
                                <h3 className="text-base font-bold text-gray-800 mb-1">Mes commandes</h3>
                                <p className="text-sm text-gray-600">Historique de vos achats</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#B76E79]/10 flex items-center justify-center">
                            <BiChevronRight size={20} className="text-[#B76E79]" />
                        </div>
                    </button>
                </div>

                {/* Section Adresses */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-800">Adresses</h3>
                        <button
                            onClick={handleAddAddress}
                            className="flex items-center gap-2 px-4 py-2 bg-[#B76E79] text-white rounded-full text-sm font-semibold hover:bg-[#A05A6A] transition-colors"
                        >
                            <BiPlus size={18} />
                            Ajouter
                        </button>
                    </div>
                    
                    {isLoadingAddresses ? (
                        <div className="text-center py-4 text-gray-500">Chargement...</div>
                    ) : addresses.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <HiOutlineLocationMarker size={32} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-3">Aucune adresse enregistrée</p>
                            <button
                                onClick={handleAddAddress}
                                className="text-sm text-[#B76E79] font-semibold hover:underline"
                            >
                                Ajouter une adresse
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineLocationMarker size={18} className="text-[#B76E79]" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {address.fullAddress || `${address.street}, ${address.city}, ${address.country}`}
                                                </p>
                                                {address.isDefault && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#B76E79] text-white text-xs rounded-full">
                                                        Par défaut
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditAddress(address)}
                                                className="p-2 text-gray-600 hover:text-[#B76E79] transition-colors"
                                                title="Modifier"
                                            >
                                                <BiEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                disabled={deleteAddressMutation.isPending}
                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                                                title="Supprimer"
                                            >
                                                <BiTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section Mes favoris - Navigation vers la page favoris */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/favoris')}
                        className="w-full flex items-center justify-between py-2"
                    >
                        <div className="flex items-center gap-3">
                            <BiHeart size={20} className="text-[#B76E79]" />
                            <div className="text-left">
                                <h3 className="text-base font-bold text-gray-800 mb-1">Mes favoris</h3>
                                <p className="text-sm text-gray-600">
                                    {favoritesCount} parfum{favoritesCount > 1 ? 's' : ''} enregistré{favoritesCount > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#B76E79]/10 flex items-center justify-center">
                            <BiChevronRight size={20} className="text-[#B76E79]" />
                        </div>
                    </button>
                </div>
            </div>

            <Navbar />

            {/* Address Modal */}
            <AddressModal
                isOpen={showAddressModal}
                onClose={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                }}
                address={editingAddress}
                onSuccess={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                }}
            />
        </div>
    );
}

export default Utilisateur;
