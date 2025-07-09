import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { IoLogOutOutline } from "react-icons/io5";
import mentoraLogo from "../../assets/mentora.svg";
import "../../assets/utils.css"; // Importamos los estilos de animaciones

interface ChatHeaderProps {
  userName?: string;
  onLogout: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  userName,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Obtener la inicial del nombre para el avatar
  const getInitial = () => {
    if (!userName) return "U";
    return userName.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-amber-50/70 border-b border-gray-200 p-3 sm:p-4 shadow-sm flex-shrink-0 relative">
      {/* Estructura de tres columnas para centrado perfecto */}
      <div className="grid grid-cols-3 items-center w-full">
        {/* Columna izquierda (vacía para balancear) */}
        <div className="col-span-1"></div>
        
        {/* Columna central con logo y título */}
        <div className="col-span-1 flex items-center justify-center space-x-2">
          <img 
            src={mentoraLogo} 
            alt="Mentora Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8"
          />
          <h1 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
            <span>Mentora</span>
          </h1>
        </div>
        
        {/* Columna derecha con avatar */}
        <div className="col-span-1 flex justify-end">
          <div className="relative" ref={dropdownRef}>
            <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer">
              <div className="relative group">
                <Avatar 
                  className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-white avatar-hover"
                  style={{
                    background: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
                    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <AvatarFallback 
                    className="bg-transparent text-white font-medium"
                    style={{
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    {getInitial()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ring-2 ring-white bg-green-500 avatar-pulse"></span>
              </div>
            </div>
            
            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100" 
                style={{
                  animation: "fadeIn 0.2s ease-out forwards",
                  transformOrigin: "top right"
                }}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-0.5">Conectado como</p>
                  <p className="font-medium text-gray-800 truncate">{userName}</p>
                </div>
                <div className="py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 px-4 py-2 text-sm group"
                  >
                    <div className="flex items-center">
                      <div className="mr-3 bg-red-100 group-hover:bg-red-200 p-1.5 rounded-full">
                        <IoLogOutOutline className="h-4 w-4 text-red-600" />
                      </div>
                      <span>Cerrar sesión</span>
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;