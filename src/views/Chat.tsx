import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "../components/ui/ScrollArea";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
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

  return (
    <div className="flex h-[100dvh] sm:h-screen bg-gradient-to-br from-amber-50/50 to-red-50/20 relative">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        onLogout={handleLogout}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] sm:h-full">
        {/* Header */}
        <ChatHeader
          userName={user?.displayName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Messages */}
        <ScrollArea className="flex-1 p-2 sm:p-4 min-h-0">
          <div className="max-w-full lg:max-w-4xl mx-auto space-y-4 sm:space-y-6">
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
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSendMessage()}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;