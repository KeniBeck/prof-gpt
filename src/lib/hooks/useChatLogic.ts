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
        // Manejar error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Lo siento, ocurrió un error: ${
            response.error || "Error desconocido"
          }`,
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

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    activeRequestType,
    setActiveRequestType
  };
};