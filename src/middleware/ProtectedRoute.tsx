import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  requireTeacher?: boolean;
}

const ProtectedRoute = ({ children, requireTeacher = true }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación con el servidor
  if (isLoading) {
    return (
      <Loader 
        message="Verificando autenticación..." 
        subMessage="Validando con el servidor" 
        size="md" 
        fullScreen={true}
        showLogo={true}
      />
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