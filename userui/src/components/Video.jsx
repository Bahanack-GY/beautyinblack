import video from '../assets/newvideo.mp4'
import { motion } from "framer-motion";
import { useRef } from "react";

/**
 * Composant pour animer chaque caractère individuellement
 * Chaque lettre apparaît avec un léger délai pour créer un effet de frappe
 */
function AnimatedCharacter({ char, index }) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            className="inline-block"
        >
            {/* Remplace les espaces par des espaces insécables pour éviter la coupure */}
            {char === " " ? "\u00A0" : char}
        </motion.span>
    );
}

/**
 * Composant principal d'affichage vidéo avec animation de texte
 * Affiche une vidéo en arrière-plan avec le titre "Beauty in black" animé
 */
function VideoDisplay(){
    const videoRef = useRef(null);

    // Texte à afficher avec animation
    const text = "Beuty in black";
    const characters = text.split("");

    return(
        <div ref={videoRef} className="relative w-full h-[70vh] overflow-hidden">
            {/* Vidéo de fond en lecture automatique et en boucle */}
            <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
            {/* Dégradé pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF9F6]"></div>

            {/* Texte superposé avec effet de frappe */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold text-white text-center px-2"
                     style={{ fontFamily: "'Brillant', cursive", textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    {characters.map((char, index) => (
                        <AnimatedCharacter
                            key={index}
                            char={char}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VideoDisplay