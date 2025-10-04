import { BiHomeAlt2 } from "react-icons/bi";
import { CiStar } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { BiArchive } from "react-icons/bi";
function Navbar(){
    return(
        <div className="flex w-full justify-center">
            <div className="fixed bottom-5 z-50 bg-[#b76e79dd] shadow-md items-center px-5 py-3 rounded-full flex gap-5">
            <button className="flex items-center flex-col">
                <BiHomeAlt2 size={30} color={"#FAF9F6"}/>
                <p className="text-white text-sm font-semibold">Accueil</p>
            </button>
            <button className="flex items-center flex-col">
                <BiArchive size={30} color={"#FAF9F6"}/>
                <p className="text-white text-sm font-semibold">Decouvrir</p>
            </button>
            <button className="flex items-center flex-col">
                <CiStar size={30} color={"#FAF9F6"}/>
                <p className="text-white text-sm font-semibold">Favoris</p>
            </button>
            <button className="flex items-center flex-col">
                <FaRegUser size={30} color={"#FAF9F6"}/>
                <p className="text-white text-sm font-semibold">Utilisateur</p>
            </button>
        </div>

        </div>
        
    )
}

export default Navbar