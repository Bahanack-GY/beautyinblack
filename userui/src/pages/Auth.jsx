import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiUser, BiLock, BiEnvelope, BiPhone } from "react-icons/bi";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/Logo.png";

/**
 * Page Auth - Connexion et Inscription
 * Permet de basculer entre le formulaire de connexion et d'inscription
 */
function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup, isLoading, error } = useAuth();
    
    // États pour le formulaire de connexion
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    
    // États pour le formulaire d'inscription
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPhone, setSignupPhone] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        login({ email: loginEmail, password: loginPassword });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        // Vérifier que les mots de passe correspondent
        if (signupPassword !== signupConfirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        signup({
            name: signupName,
            email: signupEmail,
            phone: signupPhone,
            password: signupPassword,
            confirmPassword: signupConfirmPassword
        });
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        // Réinitialiser les formulaires lors du changement
        setLoginEmail("");
        setLoginPassword("");
        setSignupName("");
        setSignupEmail("");
        setSignupPhone("");
        setSignupPassword("");
        setSignupConfirmPassword("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#FAF9F6] px-5 py-8">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <img
                    src={logo}
                    alt="Beauty in Black"
                    className="h-20 w-20 object-contain mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900 text-center">Beauty in Black</h1>
                <p className="text-sm text-gray-500 text-center">A LUXURIOUS PERFUME</p>
            </motion.div>

            {/* Conteneur du formulaire */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6"
            >
                {/* Toggle entre Login et Signup */}
                <div className="flex items-center justify-center mb-6 bg-gray-100 rounded-2xl p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                            isLogin
                                ? "bg-[#B76E79] text-white shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                            !isLogin
                                ? "bg-[#B76E79] text-white shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Inscription
                    </button>
                </div>

                {/* Formulaire de connexion */}
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleLogin}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Bienvenue
                            </h2>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <BiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe oublié */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-[#B76E79] hover:underline"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="text-red-500 text-sm text-center mt-2">
                                    {error.message || 'Une erreur est survenue'}
                                </div>
                            )}

                            {/* Bouton de connexion */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-[#B76E79] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#A05A6A] transition-colors shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Connexion...' : 'Se connecter'}
                            </motion.button>

                            {/* Lien vers inscription */}
                            <p className="text-center text-sm text-gray-600 mt-4">
                                Pas encore de compte ?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-[#B76E79] font-semibold hover:underline"
                                >
                                    S'inscrire
                                </button>
                            </p>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSignup}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Créer un compte
                            </h2>

                            {/* Nom complet */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Nom complet
                                </label>
                                <div className="relative">
                                    <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        placeholder="Votre nom"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <BiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        value={signupPhone}
                                        onChange={(e) => setSignupPhone(e.target.value)}
                                        placeholder="+237 6 12 34 56 78"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <BiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Confirmer mot de passe */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <BiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        value={signupConfirmPassword}
                                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="text-red-500 text-sm text-center mt-2">
                                    {error.message || 'Une erreur est survenue'}
                                </div>
                            )}

                            {/* Bouton d'inscription */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-[#B76E79] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#A05A6A] transition-colors shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Inscription...' : 'S\'inscrire'}
                            </motion.button>

                            {/* Lien vers connexion */}
                            <p className="text-center text-sm text-gray-600 mt-4">
                                Déjà un compte ?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-[#B76E79] font-semibold hover:underline"
                                >
                                    Se connecter
                                </button>
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default Auth;

