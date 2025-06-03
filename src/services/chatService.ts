import axios from 'axios';

// Interfaces para el servicio de chat
export interface ChatRequest {
  usuario: string;
  pregunta: string;
}

export interface ChatResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Configuración base del servicio
const CHAT_API_BASE_URL = 'https://2lqqjvlg14.execute-api.us-east-2.amazonaws.com';

// Crear instancia de axios con configuración base
const chatApiClient = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requests (opcional)
chatApiClient.interceptors.request.use(
  (config) => {
    console.log('Enviando mensaje al chatbot:', config.data);
    return config;
  },
  (error) => {
    console.error('Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejo de responses
chatApiClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta del chatbot recibida');
    return response;
  },
  (error) => {
    console.error('Error en response:', error);
    return Promise.reject(error);
  }
);

/**
 * Servicio principal para interactuar con el chatbot
 */
class ChatService {
  /**
   * Envía una pregunta al endpoint de planificación
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Pregunta o consulta del usuario
   * @returns Promise con la respuesta del chatbot
   */
  async sendMessage(usuario: string, pregunta: string): Promise<ChatResponse> {
    try {
      if (!usuario || !pregunta) {
        throw new Error('Usuario y pregunta son requeridos');
      }

      const payload: ChatRequest = {
        usuario: usuario.trim(),
        pregunta: pregunta.trim(),
      };

      const response = await chatApiClient.post('/planificacion', payload);

      return {
        success: true,
        data: response.data,
        message: 'Mensaje enviado exitosamente',
      };
    } catch (error) {
      console.error('Error al enviar mensaje:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        return {
          success: false,
          error: `Error ${status}: ${message}`,
        };
      }

      return {
        success: false,
        error: 'Error desconocido al enviar mensaje',
      };
    }
  }

  /**
   * Método para validar que el usuario esté autenticado antes de enviar mensaje
   * @param usuario - Email del usuario
   * @param pregunta - Pregunta del usuario
   * @returns Promise con la respuesta validada
   */
  async sendAuthenticatedMessage(usuario: string, pregunta: string): Promise<ChatResponse> {
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario)) {
      return {
        success: false,
        error: 'Email de usuario no válido',
      };
    }

    // Validar que la pregunta no esté vacía y tenga longitud mínima
    if (!pregunta || pregunta.trim().length < 3) {
      return {
        success: false,
        error: 'La pregunta debe tener al menos 3 caracteres',
      };
    }

    return this.sendMessage(usuario, pregunta);
  }

  /**
   * Método para obtener el estado de salud del servicio
   * @returns Promise indicando si el servicio está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Intentar hacer una petición simple al endpoint
      await chatApiClient.get('/health', { timeout: 5000 });
      return true;
    } catch (error) {
      console.warn('Servicio de chat no disponible:', error);
      return false;
    }
  }
}

// Crear instancia singleton del servicio
const chatService = new ChatService();

export { chatService };
export default chatService;