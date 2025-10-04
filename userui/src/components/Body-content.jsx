import { HiAdjustmentsVertical } from "react-icons/hi2";
import ProductCard from "./Product-card";

function BodyContent(){
    return(
        <div className="flex flex-col bg-[#FAF9F6] h-screen w-full">
                {/* search  section*/}

            <form action="">
                <div className=" w-full h-full px-5 gap-3 flex pt-5 pb-3">
                    <input className="w-full rounded-full px-2 border-2 border-gray-300  text-black " placeholder="Rechercher un produit..."></input>
                    <button><HiAdjustmentsVertical size={45} color="gray"/></button>
                </div>
            </form>
            {/* categories section */}
            <div className="flex justify-evenly"> 
                <button className="bg-[#B76E79] text-white px-3 py-1 rounded-full">Tout</button>
                <button className="bg-[#B76E79] text-white px-3 py-1 rounded-full">Hommes</button>
                <button className="bg-[#B76E79] text-white px-3 py-1 rounded-full">Femmes</button>
                <button className="bg-[#B76E79] text-white px-3 py-1 rounded-full">Enfants</button>
            </div>
            {/* products section */}
            <div className="grid grid-cols-2 gap-3 px-4 py-3 mb-52">
                <ProductCard  />
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
        </div>
    )
}
export  default BodyContent