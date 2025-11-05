import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import VideoDisplay from "../components/Video";
import BodyContent from "../components/Body-content";
import { FaScroll } from "react-icons/fa";

/**
 * Page d'accueil principale
 * Affiche une vidéo de fond avec effet parallaxe lors du scroll
 * Le contenu des produits apparaît en dessous avec une animation
 */
function Home() {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Effet parallaxe qui commence après la fin de l'animation de texte
    // Le contenu remonte progressivement lors du scroll
    const contentY = useTransform(scrollY, [20, 2000], [0, -100]);
    const contentOpacity = useTransform(scrollY, [100, 150], [1, 2]);

    return(
        <div ref={containerRef} className="relative bg-[#FAF9F6] min-h-screen w-screen overflow-x-hidden pt-16">
            <Header/>

            {/* Vidéo de fond fixe */}
            <div className="fixed top-16 left-0 w-full z-0">
                <VideoDisplay />
            </div>

            {/* Contenu qui se déplace par-dessus la vidéo avec effet parallaxe */}
            <motion.div
                style={{ y: contentY, opacity: contentOpacity }}
                className="relative z-10 mt-[82vh] bg-[#FAF9F6] rounded-t-3xl shadow-2xl pb-32"
            >
                <BodyContent />
                {/* Icône de scroll en bas à droite */}
                <FaScroll className="absolute bottom-0 right-0 m-5 text-gray-500" size={24} />
            </motion.div>

            <Navbar />
        </div>
    )
}

export default Home;