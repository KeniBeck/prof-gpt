import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IoSend, IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { ChatRequestType } from "../../services/chatService";
import TypeSelector from "./TypeSelector";
import { quickActionInstructions } from "../../lib/helpers/quickActionInstructions";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  activeRequestType?: string;
  onTypeSelect?: (type: string) => void;
  onShowInstructions?: (type: string, instructions: string) => void;
  onTypeSelectorToggle?: (isVisible: boolean) => void;
  gestionFileBase64?: string;
  setGestionFileBase64?: (base64: string) => void;
  gestionFileName?: string;
  setGestionFileName?: (name: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
  activeRequestType = ChatRequestType.DEFAULT,
  onTypeSelect,
  onShowInstructions,
  onTypeSelectorToggle,
  gestionFileBase64,
  setGestionFileBase64,
  setGestionFileName,
}) => {
  const isQuickActionSelected = activeRequestType !== ChatRequestType.DEFAULT;
  const inputDisabled = disabled || !isQuickActionSelected;
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Estado para archivo Excel en gestión
  const [gestionFile, setGestionFile] = useState<File | null>(null);

  // Efecto para notificar cuando cambia la visibilidad del selector
  useEffect(() => {
    if (onTypeSelectorToggle) {
      onTypeSelectorToggle(showTypeSelector);
    }
  }, [showTypeSelector, onTypeSelectorToggle]);

  return (
    <div className="bg-amber-50 border-t border-gray-200 p-3 sm:p-4 shadow-lg">
      <div className="max-w-full lg:max-w-4xl mx-auto pt-1">
        {/* Botón para mostrar/ocultar selector de tipo */}
        {onTypeSelect && (
          <div className={`flex justify-between items-center ${showTypeSelector ? 'mb-2' : 'mb-1'}`}>
            <div className="flex-1">
              {showTypeSelector && (
                <TypeSelector
                  activeType={activeRequestType}
                  onTypeSelect={(type) => {
                    if (onTypeSelect) {
                      onTypeSelect(type);
                      
                      // Si hay una función para mostrar instrucciones, la llamamos
                      if (onShowInstructions) {
                        const actionType = type as keyof typeof quickActionInstructions;
                        const instructions = quickActionInstructions[actionType] || 
                          'Escribe tu consulta específica para esta acción.';
                        onShowInstructions(type, instructions);
                      }
                    }
                  }}
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
            {activeRequestType === ChatRequestType.GESTION ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="gestion-excel-upload" className="w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-dashed border-red-300 bg-white hover:bg-red-50 text-red-400 font-medium text-xs transition-all shadow-sm">
                  <span className="material-icons" style={{fontSize: '18px'}}>upload_file</span>
                  {gestionFile ? gestionFile.name : "Selecciona archivo Excel (.xlsx)"}
                </label>
                <input
                  id="gestion-excel-upload"
                  type="file"
                  accept=".xlsx"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    setGestionFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const base64 = (reader.result as string).split(",")[1];
                        if (setGestionFileBase64) setGestionFileBase64(base64);
                        if (setGestionFileName) setGestionFileName(file.name);
                        onChange(base64); // El mensaje será el base64
                      };
                      reader.readAsDataURL(file);
                    } else {
                      if (setGestionFileBase64) setGestionFileBase64("");
                      if (setGestionFileName) setGestionFileName("");
                      onChange("");
                    }
                  }}
                  className="hidden"
                  disabled={inputDisabled}
                />
                <Button
                  onClick={onSend}
                  disabled={!gestionFile || !gestionFileBase64 || inputDisabled}
                  size="sm"
                  className="w-full"
                >
                  Enviar archivo Excel
                </Button>
              </div>
            ) : (
              <>
                <Input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyPress={onKeyPress}
                  placeholder={isQuickActionSelected
                    ? "Escribe tu pregunta..."
                    : "Selecciona una opción arriba para comenzar..."}
                  className="pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base 
                           border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white"
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
              </>
            )}
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