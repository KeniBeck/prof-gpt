import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireTeacher?: boolean;
}

const ProtectedRoute = ({ children, requireTeacher = true }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación con el servidor
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
          <p className="mt-2 text-sm text-gray-500">Validando con el servidor</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere ser profesor y no lo es, redirigir al login
  if (requireTeacher && user && !user.isTeacher) {
    return <Navigate to="/" replace />;
  }

  // Si todo está correcto, mostrar el componente protegido
  return <>{children}</>;
};

export default ProtectedRoute;