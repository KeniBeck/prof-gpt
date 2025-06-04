import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import type { Conversation } from "../lib/interface/chat";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChatLogic } from "../lib/hooks/useChatLogic";

// Componentes
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import QuickActions from "../components/chat/QuickActions";
import ChatInput from "../components/chat/ChatInput";

const Chat = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useChatLogic(user?.email);

  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Resto del estado...
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Plan de clase: Matemáticas",
      lastMessage: "Actividades para fracciones",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      title: "Evaluación de Ciencias",
      lastMessage: "Rúbrica para experimentos",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "3",
      title: "Actividades de Lectura",
      lastMessage: "Comprensión lectora 5to grado",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]);

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

  // Solución: cerrar teclado al abrir sidebar
  useEffect(() => {
    if (sidebarOpen && isKeyboardVisible) {
      // Desenfocar el input para ocultar el teclado
      document.activeElement instanceof HTMLElement && document.activeElement.blur();
    }
  }, [sidebarOpen, isKeyboardVisible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      // Solo cerramos el sidebar en resize si NO estamos en desktop
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else if (window.innerWidth >= 1024 && !sidebarOpen) {
        // En desktop, siempre mostramos el sidebar
        setSidebarOpen(true);
      }
    };

    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    await sendMessage(messageContent);
    setInputValue("");
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

  // Función mejorada para toggle sidebar
  const toggleSidebar = () => {
    // Si vamos a abrir el sidebar, asegúrate de desenfocar cualquier input primero
    if (!sidebarOpen) {
      document.activeElement instanceof HTMLElement && document.activeElement.blur();
      // Pequeño timeout para permitir que el teclado se cierre primero
      setTimeout(() => {
        setSidebarOpen(true);
      }, 50);
    } else {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-gradient-to-br from-amber-50/50 to-red-50/20 relative">
      {/* Overlay para móvil - AHORA A NIVEL GLOBAL */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Aumentado z-index */}
      <div className={`z-40 ${sidebarOpen ? "" : "hidden lg:block"}`}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          conversations={conversations}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[100dvh] max-h-[100dvh] relative">
        {/* Header */}
        <ChatHeader
          userName={user?.displayName}
          onToggleSidebar={toggleSidebar}
        />

        {/* Messages Area con padding para el input flotante */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-full lg:max-w-4xl mx-auto p-4 space-y-4 sm:space-y-6">
            {messages.length === 1 && (
              <QuickActions
                userName={user?.displayName}
                onActionClick={handleSendMessage}
              />
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-2 sm:space-x-3 max-w-3xl">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-green-600 text-white text-xs sm:text-sm">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-amber-50/70 border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;