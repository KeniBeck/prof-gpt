import axios from 'axios';

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  isTeacher: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
  error?: string;
  statusCode?: number;
}

export class AuthService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL;
  }

  /**
   * Verifica si un usuario es profesor
   * @param userEmail Email institucional del usuario
   * @returns Respuesta con los datos del usuario o error
   */
  async validateTeacher(userEmail: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/microsoft-graph/validate-teacher`, {
        email: userEmail
      });
      
      const statusCode = response.status;
      console.log('📡 Respuesta del servidor - Status:', statusCode);
      
      // Verificar códigos de éxito (200 o 201)
      if ((statusCode === 200 || statusCode === 201) && response.data.success && response.data.user) {
        console.log('✅ Respuesta exitosa del servidor');
        return {
          success: true,
          user: response.data.user,
          statusCode
        };
      }
      
      return {
        success: false,
        message: 'Respuesta inesperada del servidor',
        statusCode
      };
      
    } catch (error) {
      console.error('❌ Error en petición al servidor:', error);
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        console.log('📡 Error del servidor - Status:', status);
        
        switch (status) {
          case 409:
            return {
              success: false,
              message: errorData?.message || 'Usuario no encontrado en el directorio',
              error: 'USUARIO_NO_ENCONTRADO',
              statusCode: status
            };
          case 401:
            return {
              success: false,
              message: 'No autorizado',
              error: 'NO_AUTORIZADO',
              statusCode: status
            };
          case 403:
            return {
              success: false,
              message: 'Acceso denegado',
              error: 'ACCESO_DENEGADO',
              statusCode: status
            };
          case 404:
            return {
              success: false,
              message: 'Endpoint no encontrado',
              error: 'ENDPOINT_NO_ENCONTRADO',
              statusCode: status
            };
          case 500:
            return {
              success: false,
              message: 'Error interno del servidor',
              error: 'ERROR_SERVIDOR',
              statusCode: status
            };
          default:
            return {
              success: false,
              message: errorData?.message || `Error del servidor (${status})`,
              error: 'ERROR_SERVIDOR',
              statusCode: status
            };
        }
      }
      
      return {
        success: false,
        message: 'Error de red o conexión',
        error: 'ERROR_RED'
      };
    }
  }
}