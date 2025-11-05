import { BiHomeAlt2 } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { BiHeart } from "react-icons/bi";
import { BiCart } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Composant Navbar - Barre de navigation fixe en bas de l'écran
 * Affiche les 4 pages principales avec une animation de barre indicateur
 */
function Navbar(){
    const location = useLocation();

    // Configuration des éléments de navigation
    const navItems = [
        { path: "/", icon: BiHomeAlt2, label: "Accueil" },
        { path: "/cart", icon: BiCart, label: "Panier" },
        { path: "/favoris", icon: BiHeart, label: "Favoris" },
        { path: "/utilisateur", icon: BiUser, label: "Utilisateur" }
    ];

    return(
        // Navbar fixe en bas avec coins arrondis
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-lg">
            <div className="flex items-center justify-around w-full px-2 py-5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // Vérifie si la page actuelle correspond à cet élément
                    const isActive = location.pathname === item.path;

                    return (
                        <Link key={item.path} to={item.path} className="flex-1 flex flex-col items-center">
                            <div className="flex flex-col items-center relative">
                                {/* Icône avec couleur selon l'état actif */}
                                <Icon 
                                    size={24} 
                                    className={isActive ? "text-pink-300" : "text-gray-600"}
                                />
                                {/* Barre indicateur animée sous l'icône active */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute -bottom-2 w-8 h-0.5 bg-pink-300 rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default Navbar