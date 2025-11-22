import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute - Component to protect routes that require authentication
 * Redirects to /auth if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

export default ProtectedRoute;

