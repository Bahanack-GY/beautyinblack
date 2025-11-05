import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

/**
 * Page Découvrir - Page de découverte des collections
 * Affiche une page simple avec un message d'accueil
 */
function Decouvrir() {
    return (
        <div className="flex flex-col bg-[#FAF9F6] min-h-screen w-screen pb-32">
            <Header />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center flex-1 px-5"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#B76E79] mb-4">Découvrir</h1>
                    <p className="text-gray-600 text-lg">Explorez nos collections et nouveautés</p>
                </div>
            </motion.div>
            <Navbar />
        </div>
    );
}

export default Decouvrir;
