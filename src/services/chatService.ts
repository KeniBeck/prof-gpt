import axios from 'axios';

// Enumeración para tipos de consulta
export const ChatRequestType = {
  DEFAULT: 'default',
  PLANIFICADOR: 'planificador',
  RECURSOS: 'recursos', // <-- Reemplaza 'integrador' por 'recursos'
  ADECUACION: 'adecuacion',
  SEGUIMIENTO: 'seguimiento',
  GESTION: 'gestion', // <-- Agregado para QuickAction de gestión
} as const;

export type ChatRequestType = typeof ChatRequestType[keyof typeof ChatRequestType];

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
  contentType?: string;
}

// Configuración base del servicio
const CHAT_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    console.log('🚀 Enviando mensaje al chatbot:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejo de responses
chatApiClient.interceptors.response.use(
  (response) => {
    console.log('📡 Respuesta del chatbot recibida');
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', error);
    return Promise.reject(error);
  }
);

/**
 * Servicio principal para interactuar con el chatbot
 */
class ChatService {
  /**
   * Método base para enviar mensajes a cualquier endpoint del chatbot
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Pregunta o consulta del usuario
   * @param endpoint - Endpoint específico al que se enviará la petición
   * @returns Promise con la respuesta del chatbot o archivo
   */
  private async sendMessageToEndpoint(
    usuario: string, 
    pregunta: string, 
    endpoint: string
  ): Promise<ChatResponse> {
    try {
      if (!usuario || !pregunta) {
        throw new Error('Usuario y pregunta son requeridos');
      }

      const payload: ChatRequest = {
        usuario: usuario.trim(),
        pregunta: pregunta.trim(),
      };

      // Hacer la petición al endpoint específico
      const response = await chatApiClient.post(endpoint, payload, { validateStatus: () => true });

      // Manejo unificado de status codes
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        // Si contiene archivo Excel (base64 + filename + contentType)
        if (responseData.data && responseData.filename && responseData.contentType) {
          const fileBlob = this.base64ToBlob(responseData.data, responseData.contentType);
          return {
            success: true,
            data: 'Archivo generado exitosamente',
            message: 'Descarga lista',
            fileBlob: fileBlob,
            fileName: responseData.filename,
            contentType: responseData.contentType,
          };
        } else {
          // Respuesta de texto normal
          return {
            success: true,
            data: responseData.data,
            message: responseData.message || 'Respuesta recibida exitosamente',
          };
        }
      } else {
        // Manejar cualquier error (400, 500, 502, etc.)
        // Priorizar el mensaje del backend si existe
        const errorMsg = response.data?.message || response.data?.error || 
                        `Error ${response.status}: ${response.statusText || 'Error del servidor'}`;
        return {
          success: false,
          error: errorMsg,
        };
      }
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;
        
        let message = error.message;
        if (errorData?.message) {
          message = errorData.message;
        } else if (errorData?.error) {
          message = errorData.error;
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
   * Envía una pregunta al endpoint genérico de consulta (legacy)
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Pregunta o consulta del usuario
   * @returns Promise con la respuesta del chatbot o archivo
   */
  async sendMessage(usuario: string, pregunta: string): Promise<ChatResponse> {
    return this.sendMessageToEndpoint(usuario, pregunta, '/chat/consult-frontend');
  }

  /**
   * Envía una consulta específica al módulo Planificador
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Consulta de planificación de clase (grado, área, unidad, semana, número de clase)
   * @returns Promise con la respuesta del planificador (típicamente archivo Excel)
   */
  async sendPlanificadorRequest(usuario: string, pregunta: string): Promise<ChatResponse> {
    return this.sendMessageToEndpoint(usuario, pregunta, '/chat/planificador-frontend');
  }

  /**
   * Envía una consulta específica al módulo Recursos (reemplaza Integrador)
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Consulta de recursos (grado, área, unidad, tipo de recurso)
   * @returns Promise con la respuesta de recursos (puede ser PDF, DOCX, PPTX, XLSX, MP4, imágenes, ZIP)
   */
  async sendRecursosRequest(usuario: string, pregunta: string): Promise<ChatResponse> {
    return this.sendMessageToEndpoint(usuario, pregunta, '/chat/recursos-frontend');
  }

  /**
   * Envía un archivo Excel para validación y procesamiento (Módulo Gestión)
   * @param usuario - Email del usuario autenticado
   * @param filename - Nombre del archivo Excel
   * @param fileBase64 - Archivo en formato Base64
   * @returns Promise con la respuesta (éxito o Excel con errores)
   */
  async sendGestionRequest(usuario: string, filename: string, fileBase64: string): Promise<ChatResponse> {
    try {
      if (!usuario || !filename || !fileBase64) {
        throw new Error('Usuario, filename y archivo son requeridos');
      }

      const payload = {
        usuario: usuario.trim(),
        filename: filename.trim(),
        file_base64: fileBase64,
      };

      const response = await chatApiClient.post('/chat/gestion-frontend', payload, { 
        validateStatus: () => true 
      });

      // Manejo específico para gestión
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        return {
          success: true,
          message: responseData.message || 'Archivo procesado exitosamente',
        };
      } else if (response.status === 400) {
        // Errores de validación - retorna Excel con errores
        const responseData = response.data;
        if (responseData.data && responseData.filename) {
          const fileBlob = this.base64ToBlob(responseData.data, responseData.contentType);
          return {
            success: false,
            message: 'Se encontraron errores de validación',
            fileBlob: fileBlob,
            fileName: responseData.filename,
            contentType: responseData.contentType,
          };
        }
        return {
          success: false,
          error: responseData.message || responseData.error || 'Error de validación',
        };
      } else {
        // Manejar cualquier otro error (500, 502, etc.)
        const responseData = response.data;
        const errorMsg = responseData?.message || responseData?.error || 
                        `Error ${response.status}: ${response.statusText || 'Error del servidor'}`;
        return {
          success: false,
          error: errorMsg,
        };
      }
    } catch (error) {
      console.error('❌ Error al enviar archivo de gestión:', error);
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const message = errorData?.message || errorData?.error || error.message;
        return {
          success: false,
          error: message,
        };
      }

      return {
        success: false,
        error: 'Error desconocido al enviar archivo',
      };
    }
  }

  /**
   * Envía una consulta específica al módulo Adecuación
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Consulta de adecuación pedagógica (nombre estudiante, grado, área, detalle adecuación)
   * @returns Promise con la respuesta de adecuación (típicamente archivo Excel)
   */
  async sendAdecuacionRequest(usuario: string, pregunta: string): Promise<ChatResponse> {
    return this.sendMessageToEndpoint(usuario, pregunta, '/chat/adecuacion-frontend');
  }

  /**
   * Envía una consulta específica al módulo Seguimiento
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Consulta de seguimiento (avance de planificaciones por docente o grado-área)
   * @returns Promise con la respuesta de seguimiento
   */
  async sendSeguimientoRequest(usuario: string, pregunta: string): Promise<ChatResponse> {
    return this.sendMessageToEndpoint(usuario, pregunta, '/chat/seguimiento-frontend');
  }

  /**
   * Valida una pregunta según los requisitos del backend (10-500 caracteres)
   * @param pregunta - Pregunta a validar
   * @returns Resultado de la validación
   */
  validatePregunta(pregunta: string): { valid: boolean; error?: string } {
    if (!pregunta || pregunta.trim().length === 0) {
      return { valid: false, error: 'La pregunta no puede estar vacía' };
    }
    if (pregunta.trim().length < 10) {
      return { valid: false, error: 'La pregunta debe tener al menos 10 caracteres' };
    }
    if (pregunta.trim().length > 500) {
      return { valid: false, error: 'La pregunta no debe exceder 500 caracteres' };
    }
    return { valid: true };
  }

  /**
   * Valida un email
   * @param email - Email a validar
   * @returns true si es válido
   */
  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida un archivo para gestión (tamaño y extensión)
   * @param file - Archivo a validar
   * @returns Resultado de la validación
   */
  validateGestionFile(file: File): { valid: boolean; error?: string } {
    // Validar extensión
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return { valid: false, error: 'Solo se permiten archivos Excel (.xlsx o .xls)' };
    }
    
    // Validar tamaño (10MB máximo)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { valid: false, error: 'El archivo no debe superar 10MB' };
    }
    
    // Validar nombre (255 caracteres máximo)
    if (file.name.length > 255) {
      return { valid: false, error: 'El nombre del archivo es demasiado largo' };
    }
    
    return { valid: true };
  }

  /**
   * Método unificado para enviar mensajes según el tipo de consulta
   * @param usuario - Email del usuario autenticado
   * @param pregunta - Pregunta o consulta del usuario
   * @param tipo - Tipo de consulta (planificador, recursos, adecuación, seguimiento)
   * @returns Promise con la respuesta según el tipo de consulta
   */
  async sendRequestByType(
    usuario: string, 
    pregunta: string, 
    tipo: ChatRequestType = ChatRequestType.DEFAULT
  ): Promise<ChatResponse> {
    // Validar pregunta (10-500 caracteres)
    const preguntaValidation = this.validatePregunta(pregunta);
    if (!preguntaValidation.valid) {
      return {
        success: false,
        error: preguntaValidation.error,
      };
    }

    // Validar formato de email
    if (!this.validateEmail(usuario)) {
      return {
        success: false,
        error: 'Email de usuario no válido',
      };
    }

    // Enviar la consulta al endpoint correspondiente según el tipo
    switch (tipo) {
      case ChatRequestType.PLANIFICADOR:
        return this.sendPlanificadorRequest(usuario, pregunta);
      case ChatRequestType.RECURSOS:
        return this.sendRecursosRequest(usuario, pregunta);
      case ChatRequestType.ADECUACION:
        return this.sendAdecuacionRequest(usuario, pregunta);
      case ChatRequestType.SEGUIMIENTO:
        return this.sendSeguimientoRequest(usuario, pregunta);
      case ChatRequestType.DEFAULT:
      default:
        return this.sendMessage(usuario, pregunta);
    }
  }

  /**
   * Convierte una cadena base64 a Blob
   * @param base64 - Cadena en base64
   * @param contentType - Tipo de contenido del archivo
   * @returns Blob del archivo
   */
  private base64ToBlob(base64: string, contentType: string): Blob {
    try {
      // Eliminar el prefijo data:... si existe
      const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
      
      // Decodificar base64
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: contentType });
    } catch (error) {
      console.error('❌ Error al convertir base64 a blob:', error);
      throw new Error('Error al procesar el archivo');
    }
  }

  /**
   * Método para validar que el usuario esté autenticado antes de enviar mensaje
   * @param usuario - Email del usuario
   * @param pregunta - Pregunta del usuario
   * @returns Promise con la respuesta validada
   * @deprecated Use sendRequestByType instead
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
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar la URL después de un tiempo para liberar memoria
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ Descarga iniciada:', fileName);
    } catch (error) {
      console.error('❌ Error al descargar archivo:', error);
      throw new Error('Error al descargar el archivo');
    }
  }

  /**
   * Método para obtener el estado de salud del servicio
   * @returns Promise indicando si el servicio está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Verificar el endpoint de salud del backend
      const response = await chatApiClient.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('⚠️ Servicio de chat no disponible:', error);
      return false;
    }
  }
}

// Crear instancia singleton del servicio
const chatService = new ChatService();

export { chatService };
export default chatService;