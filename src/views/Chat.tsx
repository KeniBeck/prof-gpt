import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChatLogic } from "../lib/hooks/useChatLogic";
import { ChatRequestType } from "../services/chatService";

// Componentes
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import QuickActions from "../components/chat/QuickActions";
import ChatInput from "../components/chat/ChatInput";
import ChatLoader from "../components/ui/ChatLoader";

const Chat = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage, activeRequestType, setActiveRequestType } = useChatLogic(user?.email);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Detectar cambios de tamaño para el teclado
  useEffect(() => {
    const detectKeyboard = () => {
      // En móviles, cuando el teclado aparece, la altura de la ventana disminuye
      const isKeyboard = window.innerHeight < window.outerHeight * 0.75;
      setIsKeyboardVisible(isKeyboard);
    };

    window.addEventListener('resize', detectKeyboard);
    return () => window.removeEventListener('resize', detectKeyboard);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content?: string, requestType?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Si no hay un tipo de consulta activo y no se proporciona uno, no permitimos el envío
    if (activeRequestType === ChatRequestType.DEFAULT && !requestType) {
      alert("Por favor, selecciona primero una opción (Planificador, Integrador, Adecuación, Seguimiento)");
      return;
    }

    await sendMessage(messageContent, requestType);
    setInputValue("");
  };

  // Función para manejar la selección de un tipo de consulta sin enviar mensaje
  const handleTypeSelection = (type: string, placeholder?: string) => {
    setActiveRequestType(type);
    // Si hay un texto de ejemplo, lo colocamos en el input como sugerencia
    if (placeholder) {
      setInputValue(placeholder);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-[100dvh] bg-gradient-to-br from-amber-50/50 to-red-50/20 relative">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[100dvh] max-h-[100dvh] relative">
        {/* Header */}
        <ChatHeader
          userName={user?.displayName}
          onLogout={handleLogout}
        />

        {/* Messages Area con padding para el input flotante */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="max-w-full lg:max-w-4xl mx-auto p-4 space-y-4 sm:space-y-6">
            {messages.length === 1 && (
              <QuickActions
                userName={user?.displayName}
                onActionClick={handleTypeSelection}
              />
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && <ChatLoader />}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* Input Area - Flotante SOLO en el área de chat principal */}
        <div 
          className="absolute left-0 right-0 bottom-0 z-20"
          style={{
            transition: 'transform 0.3s ease',
            transform: isKeyboardVisible ? 'translateY(-50vh)' : 'none'
          }}
        >
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSendMessage()}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            activeRequestType={activeRequestType}
            onTypeSelect={handleTypeSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;