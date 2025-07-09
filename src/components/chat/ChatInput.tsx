import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IoSend, IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { ChatRequestType } from "../../services/chatService";
import TypeSelector from "./TypeSelector";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  activeRequestType?: string;
  onTypeSelect?: (type: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
  activeRequestType = ChatRequestType.DEFAULT,
  onTypeSelect,
}) => {
  const isQuickActionSelected = activeRequestType !== ChatRequestType.DEFAULT;
  const inputDisabled = disabled || !isQuickActionSelected;
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  return (
    <div className="bg-amber-50/70 border-t border-gray-200 p-2 sm:p-3 shadow-lg">
      <div className="max-w-full lg:max-w-4xl mx-auto">
        {/* Botón para mostrar/ocultar selector de tipo */}
        {onTypeSelect && (
          <div className="flex justify-between items-center mb-1">
            <div className="flex-1">
              {showTypeSelector && (
                <TypeSelector
                  activeType={activeRequestType}
                  onTypeSelect={onTypeSelect}
                  compact={true}
                />
              )}
            </div>
            <button
              onClick={() => setShowTypeSelector(!showTypeSelector)}
              className="text-xs text-gray-500 flex items-center ml-2 p-1 hover:bg-gray-100 rounded"
            >
              {showTypeSelector ? (
                <>
                  <IoChevronDownOutline className="h-3 w-3 mr-1" />
                  Ocultar opciones
                </>
              ) : (
                <>
                  <IoChevronUpOutline className="h-3 w-3 mr-1" />
                  {activeRequestType !== ChatRequestType.DEFAULT 
                    ? `Tipo: ${activeRequestType}` 
                    : "Seleccionar tipo"}
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={isQuickActionSelected
                ? "Escribe tu pregunta..."
                : "Selecciona una opción arriba para comenzar..."}
              className="pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base 
                       border-gray-300 focus:border-red-500 focus:ring-red-500 bg-amber-50/70"
              disabled={inputDisabled}
              data-virtualkeyboard="true"
            />
            <Button
              onClick={onSend}
              disabled={!value.trim() || inputDisabled}
              size="sm"
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 
                       bg-red-600 hover:bg-red-700 p-1 sm:p-2"
            >
              <IoSend className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center px-2">
          {!isQuickActionSelected
            ? "Por favor, selecciona una opción para comenzar (Planificador, Integrador, Adecuación, Seguimiento)"
            : "Mentora puede cometer errores. Verifica la información importante."}
        </p>
      </div>
    </div>
  );
};

export default ChatInput;