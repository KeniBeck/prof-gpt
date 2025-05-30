import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';

export const useUserIntegrityCheck = (intervalMinutes = 5) => {
  const { user, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const authService = useRef(new AuthService());

  useEffect(() => {
    if (!user) {
      // Si no hay usuario, limpiar cualquier intervalo existente
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Configurar verificación periódica con el servidor
    intervalRef.current = setInterval(async () => {
      console.log('🔍 Verificación periódica con servidor...');
      try {
        const response = await authService.current.validateTeacher(user.email);
        
        if (!response.success) {
          console.warn('❌ Usuario ya no es válido según servidor, cerrando sesión');
          logout();
        } else {
          console.log('✅ Verificación periódica exitosa');
        }
      } catch (error) {
        console.error('❌ Error en verificación periódica:', error);
        // No cerrar sesión por errores de red temporales en verificación periódica
      }
    }, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, logout, intervalMinutes]);

  // Función para verificar manualmente con servidor
  const checkIntegrity = async (): Promise<boolean> => {
    if (!user) return false;
    
    console.log('🔍 Verificación manual con servidor...');
    try {
      const response = await authService.current.validateTeacher(user.email);
      
      if (!response.success) {
        console.warn('❌ Verificación manual falló, cerrando sesión');
        logout();
        return false;
      }
      
      console.log('✅ Verificación manual exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error en verificación manual:', error);
      return false;
    }
  };

  return { checkIntegrity };
};