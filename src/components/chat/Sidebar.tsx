import React from "react";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";
import {
  IoAdd,
  IoSettings,
  IoLogOut,
  IoClose,
} from "react-icons/io5";
import type { Conversation } from "../../lib/interface/chat";
import MentoraSVG from "../../assets/mentora.svg";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  onLogout,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
      } fixed lg:fixed top-0 left-0 z-30 w-80 sm:w-72 md:w-80 
      lg:w-80 xl:w-96 h-[100dvh] sm:h-full transition-transform duration-300 ease-in-out
      bg-amber-50 border-r border-gray-200 flex flex-col`}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img
              src={MentoraSVG}
              alt="Mentora Logo"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              Mentora AI
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 p-1"
          >
            <IoClose className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2">
          <IoAdd className="h-4 w-4 mr-2" />
          Nueva Conversación
        </Button>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="p-2 sm:p-3 rounded-lg hover:bg-amber-100/60 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
            >
              <h3 className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                {conv.title}
              </h3>
              <p className="text-xs text-gray-600 truncate mt-1">
                {conv.lastMessage}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(conv.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-amber-100/60 hover:text-gray-900 text-sm py-2"
          >
            <IoSettings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-amber-100/60 hover:text-gray-900 text-sm py-2"
            onClick={onLogout}
          >
            <IoLogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;