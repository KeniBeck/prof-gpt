import React from "react";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import type { Message } from "../../lib/interface/chat";
import chatService, { ChatRequestType } from "../../services/chatService";
import {
  IoBookOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoAnalyticsOutline,
  IoInformationCircleOutline
} from "react-icons/io5";
import mentoraSvg from "../../assets/mentora.svg";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Verifica si es un mensaje de instrucciones
  const isInstructionMessage = message.role === "assistant" && 
    message.content.includes("**") && 
    message.requestType && 
    Object.values(ChatRequestType).includes(message.requestType as ChatRequestType);

  // Determina el icono basado en el tipo de solicitud
  const getRequestTypeIcon = () => {
    switch(message.requestType) {
      case ChatRequestType.PLANIFICADOR:
        return <IoBookOutline className="h-5 w-5 text-red-600" />;
      case ChatRequestType.INTEGRADOR:
        return <IoDocumentTextOutline className="h-5 w-5 text-red-600" />;
      case ChatRequestType.ADECUACION:
        return <IoPeopleOutline className="h-5 w-5 text-red-600" />;
      case ChatRequestType.SEGUIMIENTO:
        return <IoAnalyticsOutline className="h-5 w-5 text-red-600" />;
      default:
        return <IoInformationCircleOutline className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div
      className={`flex mb-6 sm:mb-8 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex space-x-3 sm:space-x-4 md:space-x-5 max-w-[85%] sm:max-w-3xl items-start ${
          message.role === "user" ? "flex-row-reverse space-x-reverse sm:space-x-reverse md:space-x-reverse" : ""
        }`}
      >
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 flex-shrink-0 shadow-md">
          {message.role === "user" ? (
            <div className="h-full w-full rounded-full border-2 border-red-300 overflow-hidden shadow-inner">
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs sm:text-sm md:text-base">
                P
              </AvatarFallback>
            </div>
          ) : (
            <div className="h-full w-full rounded-full border-2 border-red-200 overflow-hidden bg-white shadow-inner">
              <AvatarImage src={mentoraSvg} alt="Mentora" className="p-1" />
            </div>
          )}
        </Avatar>
        <div
          className={`rounded-lg p-4 sm:p-5 mb-2 flex-1 ${
            message.role === "user"
              ? "bg-red-600 text-white"
              : isInstructionMessage 
                ? "bg-gradient-to-br from-amber-50 via-red-50 to-amber-100 border border-amber-200 shadow-lg" 
                : "bg-amber-50 border border-gray-200"
          }`}
          style={{ marginTop: message.role === "user" ? "0" : "2px" }}
        >
          {/* Si es un mensaje de instrucciones, mostramos un diseño especial */}
          {isInstructionMessage ? (
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-full shadow-sm">
                  {getRequestTypeIcon()}
                </div>
                <span className="ml-3 font-semibold text-red-700 text-base sm:text-lg">
                  {message.content.split('\n')[0].replace(/\*\*/g, '')}
                </span>
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed px-2 py-1">
                {/* Vamos a procesar las viñetas y ejemplos para destacarlos */}
                {message.content.split('\n').slice(2).map((line, index) => {
                  if (line.trim().startsWith('-')) {
                    // Destacamos las viñetas
                    return (
                      <div key={index} className="flex items-start mb-2">
                        <span className="text-red-500 mr-2 font-bold">•</span>
                        <span>{line.trim().substring(1).trim()}</span>
                      </div>
                    );
                  } else if (line.trim().startsWith('Ejemplo:') || line.includes('Ejemplo:')) {
                    // Destacamos los ejemplos
                    return (
                      <div key={index} className="bg-amber-100 p-3 rounded-md my-3 border-l-4 border-amber-400 shadow-sm">
                        <span className="font-medium text-amber-800">Ejemplo:</span>
                        <div className="mt-1 text-gray-800 font-light italic">
                          {line.replace('Ejemplo:', '').trim()}
                        </div>
                      </div>
                    );
                  } else if (line.trim().startsWith('"') && line.trim().endsWith('"')) {
                    // Esto es para manejar los ejemplos adicionales en formato de cita
                    return (
                      <div key={index} className="bg-amber-100 p-2 rounded-md my-2 border-l-4 border-amber-400 shadow-sm">
                        <div className="text-gray-800 font-light italic">
                          {line.trim()}
                        </div>
                      </div>
                    );
                  } else {
                    // Texto normal
                    return <div key={index} className="mb-2">{line}</div>;
                  }
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          )}

          {/* Enlace de descarga si el mensaje tiene un archivo */}
          {message.fileBlob && message.fileName && (
            <div className="mt-4 pt-3 border-t border-gray-300">
              <div className="flex flex-col">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-3 flex items-start shadow-sm">
                  <span className="text-amber-500 mr-2 text-lg md:text-xl">📋</span>
                  <span className="text-xs md:text-sm text-gray-700 font-medium">Archivo generado listo para descargar</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (message.fileBlob && message.fileName) {
                      chatService.downloadFile(message.fileBlob, message.fileName);
                    }
                  }}
                  className="text-xs md:text-sm bg-white hover:bg-gray-50 border border-red-200 hover:border-red-300 text-gray-700 hover:text-gray-900 cursor-pointer w-full flex items-center justify-center px-3 py-2 md:py-3 rounded-md shadow-sm hover:shadow transition-all"
                >
                  <span className="mr-2 flex-shrink-0 text-red-500 text-base md:text-lg">📥</span>
                  <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-md overflow-hidden text-ellipsis font-medium">
                    {message.fileName}
                  </span>
                </Button>
              </div>
            </div>
          )}

          <p
            className={`text-xs mt-2 ${
              message.role === "user" ? "text-red-200" : "text-gray-500"
            }`}
          >
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;