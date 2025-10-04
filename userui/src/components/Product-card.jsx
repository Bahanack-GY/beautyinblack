import image from '../assets/sample-product.png'
function ProductCard(){
    return(
        <div className="flex flex-col shadow bg-[#e596a213] rounded-xl p-2">
            <img src={image} alt="Product image" />
            <div className="flex flex-col mt-2">
                <span className="font-bold text-lg">Nom du produit</span>
                <span className="text-gray-600">Description du produit</span>
                <span className="font-bold text-[#B76E79] mt-1">99.99 FCFA</span>
            </div>

         </div>
        
    )
}
export default ProductCard;