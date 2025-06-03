import React from "react";
import { Button } from "../ui/Button";
import { IoMenu } from "react-icons/io5";

interface ChatHeaderProps {
  userName?: string;
  onToggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  userName,
  onToggleSidebar,
}) => {
  return (
    <div className="bg-amber-50/70 border-b border-gray-200 p-3 sm:p-4 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-800 p-1 sm:p-2"
          >
            <IoMenu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
            <span className="hidden sm:inline">Mentor Educativo</span>
            <span className="sm:hidden">Mentora</span>
          </h1>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 truncate ml-2">
          <span className="hidden sm:inline">Hola, {userName}</span>
          <span className="sm:hidden">{userName?.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;