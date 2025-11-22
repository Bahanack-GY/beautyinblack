import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Decouvrir from './pages/Decouvrir'
import Favoris from './pages/Favoris'
import Cart from './pages/Cart'
import Notifications from './pages/Notifications'
import Utilisateur from './pages/Utilisateur'
import ProductDetails from './pages/ProductDetails'
import Orders from './pages/Orders'
import OrderTracking from './pages/OrderTracking'
import Category from './pages/Category'
import Auth from './pages/Auth'
import Checkout from './pages/Checkout'
import ThankYou from './pages/ThankYou'
import ProtectedRoute from './components/ProtectedRoute'

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
            {/* Route de la page des favoris - Protégée */}
            <Route path="/favoris" element={<ProtectedRoute><Favoris /></ProtectedRoute>} />
            {/* Route de la page du panier - Protégée */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            {/* Route de la page des notifications - Protégée */}
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            {/* Route de la page du profil utilisateur - Protégée */}
            <Route path="/utilisateur" element={<ProtectedRoute><Utilisateur /></ProtectedRoute>} />
            {/* Route dynamique pour les détails d'un produit (avec ID) */}
            <Route path="/product/:id" element={<ProductDetails />} />
            {/* Route de la page des commandes - Protégée */}
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            {/* Route dynamique pour le suivi d'une commande (avec ID) - Protégée */}
            <Route path="/order/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            {/* Route dynamique pour les catégories (avec nom de catégorie) */}
            <Route path="/category/:categoryName" element={<Category />} />
            {/* Route pour la page de connexion/inscription */}
            <Route path="/auth" element={<Auth />} />
            {/* Route pour la page de checkout - Protégée */}
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            {/* Route pour la page de remerciement */}
            <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
    )
}

export default App;