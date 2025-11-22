import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

/**
 * Hook personnalisé pour l'authentification
 * Gère les fonctionnalités de connexion, inscription et déconnexion
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation de connexion
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Invalider et récupérer les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Naviguer vers l'accueil
      navigate('/');
    },
  });

  // Mutation d'inscription
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Invalider et récupérer les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Naviguer vers l'accueil
      navigate('/');
    },
  });

  // Mutation de mot de passe oublié
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  // Mutation de réinitialisation de mot de passe
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    navigate('/auth');
  };

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  // Obtenir l'utilisateur actuel depuis localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    logout,
    isAuthenticated,
    getCurrentUser,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error,
  };
};

