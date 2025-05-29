import axios from 'axios';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  isTeacher: boolean;
}

export class AuthService {
  private apiUrl: string;

  constructor() {
    // URL del backend - configura según tu entorno
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/';
  }

  /**
   * Verifica si un usuario es profesor (temporalmente por dominio)
   * @param userEmail Email institucional del usuario
   * @returns Datos del usuario con indicador si es profesor (temporal)
   */
  async validateTeacher(userEmail: string): Promise<AuthUser | null> {
    try {
      // Llamar al backend para validar el usuario
      const response = await axios.post(`${this.apiUrl}/microsoft-graph/validate-teacher`, {
        email: userEmail
      });
      
      // Verificar la respuesta
      if (response.data.success && response.data.user) {
        // Si hay una nota de advertencia, muéstrala
        if (response.data.note) {
          console.warn(response.data.note);
        }
        
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error al validar usuario:', error);
      return null;
    }
  }

  /**
   * Verifica si el servidor backend está funcionando
   * @returns true si el servidor está activo, false en caso contrario
   */
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.apiUrl}/health`);
      return response.data.status === 'OK';
    } catch (error) {
      console.error('Error al verificar el estado del servidor:', error);
      return false;
    }
  }
}