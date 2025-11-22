import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import AddressModal from "../components/AddressModal";
import { BiArrowBack, BiCopy, BiCheck } from "react-icons/bi";
import { HiOutlinePhone } from "react-icons/hi";
import { useCart, useCheckout, useAddresses } from "../hooks";

/**
 * Page Checkout - Finalisation de la commande avec paiement
 * Affiche les numéros de téléphone pour paiement et permet l'upload de la capture d'écran
 */
function Checkout() {
    const navigate = useNavigate();
    const { data: cartData, isLoading: isLoadingCart } = useCart();
    const { data: addresses = [], isLoading: isLoadingAddresses, refetch: refetchAddresses } = useAddresses();
    const checkoutMutation = useCheckout();
    
    // Fonction utilitaire pour obtenir l'adresse par défaut
    const getDefaultAddress = () => {
        return addresses.find(addr => addr.isDefault) || addresses[0];
    };
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("OM"); // OM or MOMO
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);
    const [copiedNumber, setCopiedNumber] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const fileInputRef = useRef(null);

    // Numéros de téléphone pour paiement
    const paymentNumbers = {
        OM: "+237 6 12 34 56 78", // Orange Money
        MOMO: "+237 6 98 76 54 32" // MTN Mobile Money
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Valider le type de fichier
            if (!file.type.startsWith('image/')) {
                alert("Veuillez sélectionner une image");
                return;
            }
            
            // Valider la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("L'image est trop grande. Taille maximale: 5MB");
                return;
            }

            // Convertir en base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPaymentScreenshot(base64String);
                setPaymentScreenshotPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopyNumber = (number, method) => {
        navigator.clipboard.writeText(number);
        setCopiedNumber(method);
        setTimeout(() => setCopiedNumber(null), 2000);
    };

    const handleSubmit = async () => {
        if (!paymentScreenshot) {
            alert("Veuillez télécharger la capture d'écran du paiement");
            return;
        }

        const defaultAddress = getDefaultAddress();
        if (!defaultAddress) {
            setShowAddressModal(true);
            return;
        }

        checkoutMutation.mutate({
            addressId: defaultAddress.id.toString(),
            paymentMethod: selectedPaymentMethod,
            paymentScreenshot: paymentScreenshot
        }, {
            onSuccess: (data) => {
                // Naviguer vers la page de remerciement avec l'ID de commande
                navigate(`/thank-you?orderId=${data.orderId || data.order?.id}`);
            },
            onError: (error) => {
                alert(error.message || "Erreur lors de la finalisation de la commande");
            }
        });
    };

    const [pendingCheckout, setPendingCheckout] = useState(false);

    // Soumettre automatiquement le checkout quand l'adresse est ajoutée et qu'on a la capture d'écran de paiement
    useEffect(() => {
        if (pendingCheckout && paymentScreenshot) {
            const defaultAddress = getDefaultAddress();
            if (defaultAddress) {
                setPendingCheckout(false);
                checkoutMutation.mutate({
                    addressId: defaultAddress.id.toString(),
                    paymentMethod: selectedPaymentMethod,
                    paymentScreenshot: paymentScreenshot
                }, {
                    onSuccess: (data) => {
                        navigate(`/thank-you?orderId=${data.orderId || data.order?.id}`);
                    },
                    onError: (error) => {
                        alert(error.message || "Erreur lors de la finalisation de la commande");
                    }
                });
            }
        }
    }, [addresses, pendingCheckout, paymentScreenshot, selectedPaymentMethod]);

    const handleAddressAdded = () => {
        setShowAddressModal(false);
        // Définir le drapeau pour soumettre automatiquement le checkout une fois l'adresse disponible
        setPendingCheckout(true);
    };

    if (isLoadingCart) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="flex flex-col bg-white min-h-screen w-screen">
                <Header />
                <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-600 mb-2">Votre panier est vide</p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-[#B76E79] font-semibold hover:underline"
                        >
                            Continuer vos achats
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white min-h-screen w-screen pb-32">
            <Header />
            
            {/* En-tête */}
            <div className="pt-20 px-5 pb-5">
                <div className="flex items-center mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-gray-800 p-2 -ml-2"
                    >
                        <BiArrowBack size={24} />
                    </button>
                    <h1 className="flex-1 text-center text-2xl font-bold text-black mr-6">
                        Finaliser la commande
                    </h1>
                </div>
            </div>

            <div className="flex-1 px-5 space-y-6">
                {/* Résumé de la commande */}
                <div className="bg-gray-50 rounded-2xl p-5">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Résumé de la commande</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Sous-total</span>
                            <span className="font-semibold">{(cartData.subtotal || 0).toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Livraison</span>
                            <span className="font-semibold">{(cartData.shipping || 5000).toLocaleString()} FCFA</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 flex justify-between mt-3">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-[#B76E79]">
                                {(cartData.total || 0).toLocaleString()} FCFA
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sélection du mode de paiement */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Mode de paiement</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setSelectedPaymentMethod("OM")}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                selectedPaymentMethod === "OM"
                                    ? "border-[#B76E79] bg-[#B76E79]/10"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <div className="text-center">
                                <p className="font-semibold text-gray-900 mb-1">Orange Money</p>
                                <p className="text-sm text-gray-600">OM</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setSelectedPaymentMethod("MOMO")}
                            className={`p-4 rounded-xl border-2 transition-all ${
                                selectedPaymentMethod === "MOMO"
                                    ? "border-[#B76E79] bg-[#B76E79]/10"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            <div className="text-center">
                                <p className="font-semibold text-gray-900 mb-1">MTN Mobile Money</p>
                                <p className="text-sm text-gray-600">MOMO</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Numéro de téléphone pour paiement */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Effectuer le paiement</h2>
                    <div className="bg-[#B76E79]/10 rounded-xl p-5 space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">
                                Envoyez <span className="font-bold text-[#B76E79]">{(cartData.total || 0).toLocaleString()} FCFA</span> à:
                            </p>
                            <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-gray-200">
                                <div className="flex items-center gap-3">
                                    <HiOutlinePhone size={24} className="text-[#B76E79]" />
                                    <div>
                                        <p className="text-sm text-gray-600">{selectedPaymentMethod === "OM" ? "Orange Money" : "MTN Mobile Money"}</p>
                                        <p className="text-lg font-bold text-gray-900">{paymentNumbers[selectedPaymentMethod]}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCopyNumber(paymentNumbers[selectedPaymentMethod], selectedPaymentMethod)}
                                    className="p-2 rounded-lg bg-[#B76E79] text-white hover:bg-[#A05A6A] transition-colors"
                                >
                                    {copiedNumber === selectedPaymentMethod ? (
                                        <BiCheck size={20} />
                                    ) : (
                                        <BiCopy size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Après avoir effectué le paiement, téléchargez la capture d'écran ci-dessous
                        </p>
                    </div>
                </div>

                {/* Upload de la capture d'écran */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Capture d'écran du paiement</h2>
                    <div className="space-y-3">
                        {paymentScreenshotPreview ? (
                            <div className="relative">
                                <img
                                    src={paymentScreenshotPreview}
                                    alt="Payment screenshot"
                                    className="w-full rounded-xl border-2 border-gray-200"
                                />
                                <button
                                    onClick={() => {
                                        setPaymentScreenshot(null);
                                        setPaymentScreenshotPreview(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                >
                                    <BiArrowBack size={16} className="rotate-45" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#B76E79] transition-colors"
                            >
                                <p className="text-gray-600 mb-2">Cliquez pour télécharger</p>
                                <p className="text-sm text-gray-400">Format: JPG, PNG (Max 5MB)</p>
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Bouton de soumission */}
                <div className="pb-6">
                    <button
                        onClick={handleSubmit}
                        disabled={!paymentScreenshot || checkoutMutation.isPending}
                        className="w-full bg-[#B76E79] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#A05A6A] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {checkoutMutation.isPending ? 'Traitement...' : 'Confirmer la commande'}
                    </button>
                </div>
            </div>

            <Navbar />

            {/* Address Modal */}
            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSuccess={handleAddressAdded}
            />
        </div>
    );
}

export default Checkout;

