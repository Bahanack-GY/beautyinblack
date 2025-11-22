import { useNavigate } from "react-router-dom";
import { TbFileInvoice } from "react-icons/tb";
import { CiShoppingBasket } from "react-icons/ci";
import { useCart } from "../hooks";
import logo from "../assets/Logo.png";

/**
 * Composant Header - Barre de navigation fixe en haut de la page
 * Contient le logo au centre, un bouton facture à gauche et le panier à droite
 */
function Header(){
    const navigate = useNavigate();
    const { data: cartData } = useCart();
    
    // Calculer le nombre d'articles dans le panier à partir des données de l'API
    const cartCount = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return(
        // En-tête fixe en haut avec fond semi-transparent
        <div className="fixed top-0 bg-[#FAF9F6] backdrop-blur-sm bg-opacity-95 flex w-full justify-between items-center px-5 py-3 border-b border-gray-200 shadow-sm z-50">
            {/* Bouton factures/commandes (à gauche) */}
            <button
                onClick={() => navigate('/orders')}
                className="p-2 rounded-full hover:bg-[#B76E79] hover:bg-opacity-10 transition-all duration-300"
            >
                <TbFileInvoice size={28} color={"#B76E79"}/>
            </button>

            {/* Logo au centre */}
            <img
                src={logo}
                alt="logo"
                className="h-12 w-12 object-contain"
            />

            {/* Bouton panier avec badge de notification (à droite) */}
            <button
                onClick={() => navigate('/cart')}
                className="p-2 rounded-full hover:bg-[#B76E79] hover:bg-opacity-10 transition-all duration-300 relative"
            >
                <CiShoppingBasket size={28} color={"#B76E79"}/>
                {/* Badge affichant le nombre d'articles dans le panier */}
                {cartCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-[#B76E79] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                    >
                        {cartCount}
                    </span>
                )}
            </button>
        </div>
    )
}

export default Header;