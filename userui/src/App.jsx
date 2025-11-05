import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Decouvrir from './pages/Decouvrir'
import Favoris from './pages/Favoris'
import Cart from './pages/Cart'
import Notifications from './pages/Notifications'
import Utilisateur from './pages/Utilisateur'
import ProductDetails from './pages/ProductDetails'

/**
 * Composant App principal - Configuration des routes de l'application
 * Définit toutes les routes disponibles dans l'application React Router
 */
function App() {
    return(
        <Routes>
            {/* Route de la page d'accueil */}
            <Route path="/" element={<Home />} />
            {/* Route de la page de découverte */}
            <Route path="/decouvrir" element={<Decouvrir />} />
            {/* Route de la page des favoris */}
            <Route path="/favoris" element={<Favoris />} />
            {/* Route de la page du panier */}
            <Route path="/cart" element={<Cart />} />
            {/* Route de la page des notifications */}
            <Route path="/notifications" element={<Notifications />} />
            {/* Route de la page du profil utilisateur */}
            <Route path="/utilisateur" element={<Utilisateur />} />
            {/* Route dynamique pour les détails d'un produit (avec ID) */}
            <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
    )
}

export default App;