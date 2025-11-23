import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

/**
 * Hook personnalisé pour les opérations d'authentification
 * Fournit les fonctionnalités de connexion, inscription, déconnexion avec React Query
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mutation de connexion
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Stocker le token et les données utilisateur
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      // Invalider les requêtes pour actualiser les données
      queryClient.invalidateQueries();
      
      // Naviguer vers le tableau de bord
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Mutation d'inscription
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      queryClient.invalidateQueries();
      navigate('/dashboard');
    },
  });

  // Mutation de mot de passe oublié
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  // Mutation de réinitialisation de mot de passe
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      navigate('/login');
    },
  });

  // Requête pour obtenir le profil
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: authApi.getProfile,
    enabled: !!localStorage.getItem('admin_token'),
  });

  // Fonction de déconnexion
  const logout = () => {
    authApi.logout();
    queryClient.clear();
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
    
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
    
    profile,
    isLoadingProfile,
    
    logout,
  };
};

