import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
    BiHeart, 
    BiChevronRight, 
    BiArrowBack,
    BiEnvelope,
    BiPhone,
    BiStar,
    BiUser
} from "react-icons/bi";
import { 
    HiOutlineLocationMarker,
    HiOutlineMail
} from "react-icons/hi";
import { 
    FaWhatsapp,
    FaShoppingBag
} from "react-icons/fa";

/**
 * Page Utilisateur - Profil utilisateur avec informations et menu de navigation
 * Affiche les informations personnelles, coordonnées et liens vers les autres sections
 */
function Utilisateur() {
    const navigate = useNavigate();

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
                            src="https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZsZXVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" 
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    </div>
                </div>

                {/* Nom d'utilisateur et titre */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Etudiant</h2>
                    <p className="text-white/90 text-sm">Client Premium</p>
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
                                <span className="text-sm text-gray-800">sjones@beautyinblack.com</span>
                            </div>
                        </div>
                        
                    </div>
                </div>

                {/* Section Numéro de téléphone */}
                <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-3">Numéro de téléphone</h3>
                    <div className="flex items-center gap-3">
                        <BiPhone size={20} className="text-[#B76E79]" />
                        <span className="text-sm text-gray-800">+237 6 12 34 56 78</span>
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
                        onClick={() => console.log("Mes commandes")}
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

                {/* Section Adresse - Bouton cliquable */}
                <div className="mb-6">
                    <button 
                        onClick={() => console.log("Adresse")}
                        className="w-full flex items-center justify-between py-2"
                    >
                        <div className="flex items-center gap-3">
                            <HiOutlineLocationMarker size={20} className="text-[#B76E79]" />
                            <div className="text-left">
                                <h3 className="text-base font-bold text-gray-800 mb-1">Adresse</h3>
                                <p className="text-sm text-gray-600">123 Rue de la Parfumerie, Melen</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#B76E79]/10 flex items-center justify-center">
                            <BiChevronRight size={20} className="text-[#B76E79]" />
                        </div>
                    </button>
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
                                <p className="text-sm text-gray-600">4 parfums enregistrés</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#B76E79]/10 flex items-center justify-center">
                            <BiChevronRight size={20} className="text-[#B76E79]" />
                        </div>
                    </button>
                </div>
            </div>

            <Navbar />
        </div>
    );
}

export default Utilisateur;
