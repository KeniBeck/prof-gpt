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
  fileBlob?: Blob;
  fileName?: string;
}

// Configuración base del servicio
const CHAT_API_BASE_URL = 'https://2lqqjvlg14.execute-api.us-east-2.amazonaws.com';

// Crear instancia de axios con configuración base
const chatApiClient = axios.create({
  baseURL: CHAT_API_BASE_URL,
  timeout: 60000, // 60 segundos para archivos grandes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requests
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
   * Envía una pregunta al endpoint de planificación y maneja descargas de archivos
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Pregunta o consulta del usuario
   * @returns Promise con la respuesta del chatbot o archivo
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

      // Configurar la petición para manejar tanto JSON como archivos binarios
      const response = await chatApiClient.post('/planificacion', payload, {
        responseType: 'blob', // Importante: manejar como blob para archivos
      });

      // Verificar el tipo de contenido de la respuesta
      const contentType = response.headers['content-type'] || '';
      
      if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || 
          contentType.includes('application/vnd.ms-excel')) {
        
        // Es un archivo Excel
        const fileName = this.extractFileName(response.headers) || `planificacion_${Date.now()}.xlsx`;
        
        return {
          success: true,
          data: 'Archivo Excel generado exitosamente',
          message: 'Descarga iniciada',
          fileBlob: response.data,
          fileName: fileName,
        };
      } else if (contentType.includes('application/json')) {
        
        // Es una respuesta JSON - convertir blob a texto
        const text = await response.data.text();
        const jsonData = JSON.parse(text);
        
        return {
          success: true,
          data: jsonData,
          message: 'Respuesta recibida exitosamente',
        };
      } else {
        
        // Otro tipo de respuesta - tratarla como texto
        const text = await response.data.text();
        
        return {
          success: true,
          data: text,
          message: 'Respuesta recibida exitosamente',
        };
      }

    } catch (error) {
      console.error('Error al enviar mensaje:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        let message = error.message;
        
        // Intentar extraer mensaje de error si es JSON
        if (error.response?.data) {
          try {
            const errorText = await error.response.data.text();
            const errorData = JSON.parse(errorText);
            message = errorData.message || message;
          } catch {
            // Si no es JSON, usar el mensaje original
          }
        }

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
   * Extrae el nombre del archivo de los headers de respuesta
   * @param headers - Headers de la respuesta HTTP
   * @returns Nombre del archivo o null
   */
  private extractFileName(headers: any): string | null {
    const contentDisposition = headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return null;
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
   * Función auxiliar para descargar un archivo blob
   * @param blob - Blob del archivo
   * @param fileName - Nombre del archivo
   */
  downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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