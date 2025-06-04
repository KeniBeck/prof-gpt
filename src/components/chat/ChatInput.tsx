import React from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IoSend } from "react-icons/io5";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
}) => {
  return (
    <div className="bg-amber-50/70 border-t border-gray-200 p-3 sm:p-4 shadow-lg">
      <div className="max-w-full lg:max-w-4xl mx-auto">
        <div className="flex space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Escribe tu pregunta..."
              className="pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base 
                       border-gray-300 focus:border-red-500 focus:ring-red-500 bg-amber-50/70"
              disabled={disabled}
              data-virtualkeyboard="true"
            />
            <Button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              size="sm"
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 
                       bg-red-600 hover:bg-red-700 p-1 sm:p-2"
            >
              <IoSend className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center px-2">
          Mentora puede cometer errores. Verifica la información importante.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;