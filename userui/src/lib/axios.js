import axios from 'axios';

// Créer une instance axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer 401 Non autorisé - effacer l'authentification et rediriger vers la connexion
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Rediriger uniquement si on n'est pas déjà sur la page d'authentification
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    // Gérer les erreurs réseau
    if (!error.response) {
      console.error('Erreur réseau:', error.message);
      return Promise.reject({
        message: 'Erreur réseau. Veuillez vérifier votre connexion.',
        error: error.message,
      });
    }

    // Retourner l'erreur pour traitement par React Query
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;

