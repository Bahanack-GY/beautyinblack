/**
 * Fichier d'export central de l'API
 * Exporte tous les modules API pour faciliter l'importation
 */

export * from './authApi';
export * from './productsApi';
export * from './ordersApi';
export * from './categoriesApi';
export * from './usersApi';
export * from './notificationsApi';
export * from './dashboardApi';

// Réexporter le client axios
export { default as apiClient } from '../lib/axios';

