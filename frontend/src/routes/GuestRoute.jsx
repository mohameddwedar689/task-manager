import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Prevents an already-logged-in user from seeing the login/register forms again.
export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
