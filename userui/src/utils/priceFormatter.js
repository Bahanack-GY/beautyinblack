/**
 * Fonctions utilitaires pour le formatage des prix
 */

/**
 * Formater le prix avec la devise FCFA
 * @param {number|string} price - Valeur du prix
 * @param {boolean} includeCurrency - S'il faut inclure le suffixe "FCFA" (par défaut: true)
 * @returns {string} Chaîne de prix formatée
 */
export const formatPrice = (price, includeCurrency = true) => {
  if (price === null || price === undefined) {
    return includeCurrency ? '0 FCFA' : '0';
  }

  // Convertir en nombre si c'est une chaîne
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
  
  if (isNaN(numPrice)) {
    return includeCurrency ? '0 FCFA' : '0';
  }

  // Formater avec séparateurs de milliers
  const formatted = numPrice.toLocaleString('fr-FR');
  
  return includeCurrency ? `${formatted} FCFA` : formatted;
};

/**
 * Formater uniquement le nombre du prix (sans devise)
 * @param {number|string} price - Valeur du prix
 * @returns {string} Nombre de prix formaté
 */
export const formatPriceNumber = (price) => {
  return formatPrice(price, false);
};

