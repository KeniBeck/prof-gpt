import React from "react";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import type { Message } from "../../lib/interface/chat";
import chatService from "../../services/chatService";

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

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-3xl ${
          message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
          <AvatarFallback
            className={`text-xs sm:text-sm ${
              message.role === "user"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {message.role === "user" ? "P" : "M"}
          </AvatarFallback>
        </Avatar>
        <div
          className={`rounded-lg p-3 sm:p-4 ${
            message.role === "user"
              ? "bg-red-600 text-white"
              : "bg-amber-50 border border-gray-200"
          }`}
        >
          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>

          {/* Enlace de descarga si el mensaje tiene un archivo */}
          {message.fileBlob && message.fileName && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (message.fileBlob && message.fileName) {
                    chatService.downloadFile(message.fileBlob, message.fileName);
                  }
                }}
                className="text-xs bg-white hover:bg-gray-50 border-gray-400 text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                📥 Descargar: {message.fileName}
              </Button>
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