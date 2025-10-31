import axios from 'axios';

export interface GestionArchivoResult {
  success: boolean;
  message?: string;
  filename?: string;
  contentType?: string;
  data?: string; // base64 si hay errores
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const gestionArchivo = async (
  usuario: string,
  filename: string,
  fileBase64: string
): Promise<GestionArchivoResult> => {
  try {
    const response = await axios.post(`${API_URL}/chat/gestion-frontend`, {
      usuario,
      filename,
      file_base64: fileBase64,
    });

    // Si es éxito, solo mensaje
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
      };
    }

    // Si hay errores, devuelve el archivo en base64
    if (response.data.success === false && response.data.data) {
      return {
        success: false,
        filename: response.data.filename,
        contentType: response.data.contentType,
        data: response.data.data, // base64
      };
    }

    // Otro error
    return {
      success: false,
      message: response.data.message || 'Error inesperado en gestión',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Error de red o interno',
    };
  }
};
