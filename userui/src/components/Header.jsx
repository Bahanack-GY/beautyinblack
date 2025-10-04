import { TbFileInvoice } from "react-icons/tb";
import { CiShoppingBasket } from "react-icons/ci";
import logo from "../assets/logo.png"
function Header(){
    return(
    <>
   <div className="fixed bg-[#FAF9F6] flex w-full justify-between px-4 py-2 border-b-1 border-gray-300">
        <TbFileInvoice size={45} color={"#B76E79"}/>
        <img    src={logo} alt="logo" className="h-12 w-12 object-contain"/>
        <CiShoppingBasket size={45} color={"#B76E79"}/>
   </div>
    </>
    )
}
export default Header;