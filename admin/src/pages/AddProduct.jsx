import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, Loader2 } from 'lucide-react';
import { useCreateProduct, useUpdateProduct, useProduct } from '../hooks/useProducts';
import { useEffect } from 'react';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour le mode édition
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Homme',
    description: '',
    basePrice: '',
    skinTypes: [],
    bestSeller: false,
    status: 'active'
  });

  const [sizes, setSizes] = useState([
    { size: '30ml', price: '', stock: '' },
    { size: '50ml', price: '', stock: '' },
    { size: '100ml', price: '', stock: '' }
  ]);

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Stocker les objets File réels

  // Récupérer les données du produit si en mode édition
  const { data: product, isLoading: isLoadingProduct } = useProduct(id);

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const categories = ['Homme', 'Femme', 'Enfant', 'Mixte'];
  const skinTypeOptions = ['sèche', 'grasse', 'mixte', 'sensible', 'normale'];

  // Charger les données du produit pour le mode édition
  useEffect(() => {
    if (isEditMode && product) {
      // Convertir le prix des centimes vers la valeur d'affichage (diviser par 100)
      const displayPrice = product.priceNumber ? (product.priceNumber / 100).toString() : '';
      
      setFormData({
        name: product.name || '',
        category: product.category || 'Homme',
        description: product.description || '',
        basePrice: displayPrice,
        skinTypes: product.skinTypes || [],
        bestSeller: product.bestSeller || false,
        status: product.status || 'active'
      });
      
      if (product.sizes && Array.isArray(product.sizes)) {
        // Si les tailles sont des chaînes, créer des entrées par défaut
        const sizesData = product.sizes.map(s => {
          if (typeof s === 'string') {
            return { size: s, price: '', stock: '' };
          }
          return {
            size: s.size || '',
            price: s.price ? (s.price / 100).toString() : '', // Convertir des centimes si nécessaire
            stock: s.stock || ''
          };
        });
        setSizes(sizesData);
      }
      
      if (product.images) {
        // Si les images sont des chaînes base64, les utiliser directement
        setImages(product.images);
        // Ne pas définir imageFiles pour les images base64 existantes
        setImageFiles([]);
      }
    }
  }, [isEditMode, product]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    const newImages = newFiles.map(file => URL.createObjectURL(file));
    setImages(newImages);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    const newImages = newFiles.map(file => URL.createObjectURL(file));
    setImages(newImages);
  };

  // Convertir le fichier  en base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSkinTypeToggle = (type) => {
    if (formData.skinTypes.includes(type)) {
      setFormData({
        ...formData,
        skinTypes: formData.skinTypes.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        skinTypes: [...formData.skinTypes, type]
      });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider les champs obligatoires
    if (!formData.name || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Valider le prix - basePrice est requis
    const priceValue = parseFloat(formData.basePrice || 0);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Veuillez entrer un prix de base valide');
      return;
    }
    
    try {
      // Convertir les fichiers d'images en base64
      let base64Images = [];
      let base64MainImage = '';
      
      // Vérifier si nous avons de nouveaux fichiers à convertir
      if (imageFiles.length > 0) {
        base64Images = await Promise.all(
          imageFiles.map(file => fileToBase64(file))
        );
        base64MainImage = base64Images[0] || '';
      } else if (images.length > 0) {
        // En mode édition, les images peuvent déjà être des chaînes base64
        // Vérifier si la première image est une chaîne base64 (commence par data:image)
        if (images[0] && images[0].startsWith('data:image')) {
          base64Images = images;
          base64MainImage = images[0] || '';
        }
      }
      
      // Valider qu'on a au moins une image
      if (!base64MainImage) {
        alert('Veuillez téléverser au moins une image');
        return;
      }

      // Valider que l'image principale est une chaîne base64 valide
      if (!base64MainImage.startsWith('data:image/')) {
        alert('Format d\'image invalide. Veuillez téléverser une image valide.');
        return;
      }
      
      // Convertir le prix en nombre (en centimes) - utiliser basePrice si fourni, sinon utiliser le prix de la première taille
      const priceInCents = Math.round(priceValue * 100);
      
      // Convertir les tailles en tableau de chaînes (juste les noms de tailles)
      const sizesArray = sizes
        .filter(s => s.size && s.price) // Inclure uniquement les tailles avec taille et prix
        .map(s => s.size);
      
      // Corriger le nom de catégorie si c'est 'Enfants' en 'Enfant'
      let category = formData.category;
      if (category === 'Enfants') {
        category = 'Enfant';
      }
      
      const productData = {
        name: formData.name.trim(),
        category: category,
        description: formData.description.trim(),
        price: priceInCents, // Nombre en centimes
        image: base64MainImage, // Image principale encodée en base64 (requis)
        skinTypes: formData.skinTypes || [],
        rating: 4.5,
        deliveryInfo: 'Livraison standard'
      };

      // Inclure les tailles uniquement s'il y en a
      if (sizesArray.length > 0) {
        productData.sizes = sizesArray;
      }

      // Inclure le tableau d'images uniquement s'il y a plusieurs images
      // Le tableau d'images doit inclure toutes les images (y compris la principale)
      if (base64Images.length > 1) {
        productData.images = base64Images;
      }
      // S'il n'y a qu'une seule image, on n'envoie pas le tableau d'images
      // (elle est déjà dans le champ image)

      // Journaliser les données envoyées (sans les images base64 complètes pour la lisibilité)
      console.log('Données du produit envoyées:', {
        ...productData,
        image: base64MainImage ? `${base64MainImage.substring(0, 50)}...` : 'empty',
        images: base64Images.map(img => img ? `${img.substring(0, 50)}...` : 'empty')
      });

      if (isEditMode) {
        updateProduct.mutate(
          { id, data: productData },
          {
            onSuccess: () => {
              alert('Produit mis à jour avec succès');
              navigate('/products');
            },
            onError: (error) => {
              console.error('Erreur de mise à jour du produit:', error);
              // Structure d'erreur de l'intercepteur axios : error.response?.data
              // Structure d'erreur backend : { statusCode, message, error, path, timestamp }
              const errorMessage = error?.message || 
                                 error?.error || 
                                 (typeof error === 'string' ? error : 'Erreur inconnue');
              alert('Erreur lors de la mise à jour: ' + errorMessage);
            },
          }
        );
      } else {
        createProduct.mutate(productData, {
          onSuccess: () => {
            alert('Produit créé avec succès');
            navigate('/products');
          },
          onError: (error) => {
            console.error('Erreur de création du produit:', error);
            // Structure d'erreur de l'intercepteur axios : error.response?.data
            // Structure d'erreur backend : { statusCode, message, error, path, timestamp }
            const errorMessage = error?.message || 
                               error?.error || 
                               (typeof error === 'string' ? error : 'Erreur inconnue');
            alert('Erreur lors de la création: ' + errorMessage);
          },
        });
      }
    } catch (error) {
      console.error('Image conversion error:', error);
      alert('Erreur lors de la conversion des images: ' + (error?.message || 'Erreur inconnue'));
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-pink-300" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditMode ? 'Modifier les informations du produit' : 'Créer une nouvelle fiche produit'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Informations de base</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Entrez le nom du produit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prix de base (FCFA)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Prix principal du produit (utilisé si aucune taille n'est spécifiée)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Entrez la description du produit"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Pricing & Stock */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Prix et stock par taille</h2>
              
              <div className="space-y-4">
                {sizes.map((sizeData, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Taille
                      </label>
                      <input
                        type="text"
                        value={sizeData.size}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prix (FCFA)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={sizeData.price}
                        onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={sizeData.stock}
                        onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Images du produit</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Téléverser</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skin Types */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Types de peau</h2>
              <div className="space-y-2">
                {skinTypeOptions.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skinTypes.includes(type)}
                      onChange={() => handleSkinTypeToggle(type)}
                      className="w-4 h-4 text-pink-300 border-gray-300 rounded focus:ring-pink-300"
                    />
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Options</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 dark:text-gray-300">Meilleure vente</span>
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-pink-300 text-white rounded-lg font-medium hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isEditMode ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : (
                  isEditMode ? 'Mettre à jour le produit' : 'Créer le produit'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="w-full py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Annuler
              </button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

