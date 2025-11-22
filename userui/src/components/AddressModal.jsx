import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiX } from "react-icons/bi";
import { useAddAddress, useUpdateAddress } from "../hooks";

/**
 * Modal component for adding/editing addresses
 */
function AddressModal({ isOpen, onClose, address = null, onSuccess }) {
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();
    
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        country: "",
        postalCode: "",
        isDefault: false
    });

    // Remplir le formulaire si on édite une adresse existante
    useEffect(() => {
        if (address) {
            setFormData({
                street: address.street || "",
                city: address.city || "",
                country: address.country || "",
                postalCode: address.postalCode || "",
                isDefault: address.isDefault || false
            });
        } else {
            setFormData({
                street: "",
                city: "",
                country: "",
                postalCode: "",
                isDefault: false
            });
        }
    }, [address, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (address) {
            // Mettre à jour l'adresse existante
            updateAddressMutation.mutate(
                { addressId: address.id, data: formData },
                {
                    onSuccess: () => {
                        onSuccess?.();
                        onClose();
                    },
                    onError: (error) => {
                        alert(error.message || "Erreur lors de la mise à jour de l'adresse");
                    }
                }
            );
        } else {
            // Ajouter une nouvelle adresse
            addAddressMutation.mutate(formData, {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                },
                onError: (error) => {
                    alert(error.message || "Erreur lors de l'ajout de l'adresse");
                }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {address ? "Modifier l'adresse" : "Ajouter une adresse"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <BiX size={24} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Street */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Rue / Adresse *
                            </label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                placeholder="Ex: 123 Rue de la Parfumerie"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ville *
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                placeholder="Ex: Yaoundé"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Pays *
                            </label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                placeholder="Ex: Cameroun"
                            />
                        </div>

                        {/* Postal Code */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Code postal
                            </label>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#B76E79] focus:outline-none transition-all"
                                placeholder="Ex: 12345"
                            />
                        </div>

                        {/* Default Address */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-[#B76E79] focus:ring-[#B76E79]"
                            />
                            <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer">
                                Définir comme adresse par défaut
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                                className="flex-1 px-4 py-3 rounded-xl bg-[#B76E79] text-white font-semibold hover:bg-[#A05A6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {(addAddressMutation.isPending || updateAddressMutation.isPending)
                                    ? "Enregistrement..."
                                    : address
                                    ? "Modifier"
                                    : "Ajouter"
                                }
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default AddressModal;

