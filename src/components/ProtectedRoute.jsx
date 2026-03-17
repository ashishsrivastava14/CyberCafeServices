import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    const redirectPath = role === 'admin' ? '/admin/dashboard' : role === 'vendor' ? '/vendor/dashboard' : '/login';
    return <Navigate to={redirectPath} replace />;
  }
  return children;
}
