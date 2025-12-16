import { useState } from "react";
import type { Message } from "../interface/chat";
import chatService, { ChatRequestType } from "../../services/chatService";

export const useChatLogic = (userEmail?: string) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "¡Hola! Soy tu mentor educativo. Estoy aquí para ayudarte con la planificación de clases, evaluaciones, actividades creativas y mucho más. ¿En qué puedo ayudarte hoy?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequestType, setActiveRequestType] = useState<string>(ChatRequestType.DEFAULT);

  const sendMessage = async (content: string, requestType?: string) => {
    if (!content.trim() || !userEmail) return;

    // Si se proporciona un tipo de consulta, lo establecemos como activo
    if (requestType) {
      setActiveRequestType(requestType);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Para gestión, NO usar sendMessage, usar sendGestionArchivo
      if ((requestType || activeRequestType) === ChatRequestType.GESTION) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '⚠️ Para gestión de archivos, por favor usa el selector de archivos Excel.',
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Usamos el nuevo método sendRequestByType con el tipo activo
      const response = await chatService.sendRequestByType(
        userEmail,
        content,
        (requestType || activeRequestType) as ChatRequestType
      );

      if (response.success) {
        if (response.fileBlob && response.fileName) {
          // Descargar el archivo automáticamente
          chatService.downloadFile(response.fileBlob, response.fileName);

          // Mostrar mensaje de confirmación con datos del archivo
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `✅ He generado el archivo solicitado. Puedes descargarlo usando el botón de abajo.`,
            role: "assistant",
            timestamp: new Date(),
            fileBlob: response.fileBlob,
            fileName: response.fileName,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          // Respuesta de texto normal
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              response.data?.toString() ||
              response.message ||
              "Respuesta recibida",
            role: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } else {
        // Manejar error con validaciones amigables
        let errorContent = `Lo siento, ocurrió un error: ${response.error || "Error desconocido"}`;
        
        // Mensajes de error más amigables
        if (response.error?.includes('10 caracteres')) {
          errorContent = '⚠️ Tu pregunta es muy corta. Por favor, escribe al menos 10 caracteres.';
        } else if (response.error?.includes('500 caracteres')) {
          errorContent = '⚠️ Tu pregunta es muy larga. Por favor, reduce el texto a máximo 500 caracteres.';
        } else if (response.error?.includes('Email')) {
          errorContent = '⚠️ Parece que hay un problema con tu correo electrónico. Por favor, cierra sesión y vuelve a iniciar.';
        }

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: errorContent,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Nuevo método para gestión: recibe base64 y filename
  const sendGestionArchivo = async (fileBase64: string, filename: string) => {
    if (!fileBase64 || !filename || !userEmail) return;
    setIsLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `📎 ${filename}`,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Usar chatService directamente
      const response = await chatService.sendGestionRequest(userEmail, filename, fileBase64);
      
      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `✅ ${response.message || 'Archivo procesado exitosamente'}`,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (response.fileBlob && response.fileName) {
        // Hay errores de validación - archivo Excel con errores
        chatService.downloadFile(response.fileBlob, response.fileName);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '⚠️ Se encontraron errores de validación en el archivo. Descarga el archivo de errores para revisarlos y corregirlos.',
          role: 'assistant',
          timestamp: new Date(),
          fileBlob: response.fileBlob,
          fileName: response.fileName,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `❌ Lo siento, ocurrió un error: ${response.error || 'Error desconocido'}`,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error al enviar archivo de gestión:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "❌ Lo siento, no pude procesar tu archivo. Por favor, verifica el formato y tamaño del archivo e inténtalo de nuevo.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    sendGestionArchivo,
    activeRequestType,
    setActiveRequestType
  };
};