import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../services/authService';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    validateStoredUser();
  }, []);

  const validateStoredUser = async () => {
    setIsLoading(true);
    
    try {
      // Verificar si hay un usuario guardado en localStorage
      const savedUser = localStorage.getItem('mentora_user');
      
      if (!savedUser) {
        console.log('📭 No hay usuario guardado en localStorage');
        setIsLoading(false);
        return;
      }

      let userData: AuthUser;
      try {
        userData = JSON.parse(savedUser);
      } catch (error) {
        console.error('❌ Error al parsear usuario guardado:', error);
        localStorage.removeItem('mentora_user');
        setIsLoading(false);
        return;
      }

      // Validar que el usuario guardado tenga las propiedades necesarias
      if (!userData.email || !userData.id || !userData.displayName) {
        console.warn('⚠️ Usuario guardado no tiene formato válido:', userData);
        localStorage.removeItem('mentora_user');
        setIsLoading(false);
        return;
      }

      // VALIDAR CON EL SERVIDOR
      console.log('🔍 Validando usuario con servidor:', userData.email);
      const response = await authService.validateTeacher(userData.email);

      if (response.success && response.user) {
        // El usuario es válido según el servidor
        console.log('✅ Usuario validado exitosamente con el servidor');
        
        // Actualizar los datos del usuario con los datos más recientes del servidor
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem('mentora_user', JSON.stringify(updatedUser));
      } else {
        // El usuario ya no es válido según el servidor
        console.warn('❌ Usuario ya no es válido según el servidor:', response.message);
        localStorage.removeItem('mentora_user');
        setUser(null);
      }
      
    } catch (error) {
      console.error('❌ Error al validar usuario con servidor:', error);
      // En caso de error de red, limpiar la sesión por seguridad
      localStorage.removeItem('mentora_user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: AuthUser) => {
    // Validar que los datos del usuario sean correctos
    if (!userData.id || !userData.email || !userData.displayName) {
      console.error('❌ Datos de usuario inválidos para login:', userData);
      return;
    }

    setUser(userData);
    localStorage.setItem('mentora_user', JSON.stringify(userData));
    console.log('✅ Usuario logueado y guardado:', userData.email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mentora_user');
    console.log('🚪 Usuario deslogueado');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};