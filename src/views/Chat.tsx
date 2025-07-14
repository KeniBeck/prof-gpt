import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChatLogic } from "../lib/hooks/useChatLogic";
import { ChatRequestType } from "../services/chatService";
import { v4 as uuidv4 } from 'uuid';

// Componentes
import ChatHeader from "../components/chat/ChatHeader";
import MessageBubble from "../components/chat/MessageBubble";
import QuickActions from "../components/chat/QuickActions";
import ChatInput from "../components/chat/ChatInput";
import ChatLoader from "../components/ui/ChatLoader";

const Chat = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { messages, setMessages, isLoading, sendMessage, activeRequestType, setActiveRequestType } = useChatLogic(user?.email);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  // Detectar cambios de tamaño para el teclado
  useEffect(() => {
    const detectKeyboard = () => {
      // En móviles, cuando el teclado aparece, la altura de la ventana disminuye
      const isKeyboard = window.innerHeight < window.outerHeight * 0.75;
      
      // Actualizamos el estado solo si hay un cambio
      if (isKeyboard !== isKeyboardVisible) {
        setIsKeyboardVisible(isKeyboard);
        
        // Si el teclado aparece, aseguramos que el scroll esté al final
        if (isKeyboard) {
          setTimeout(scrollToBottom, 300);
        }
      }
    };

    // Agregamos los event listeners
    window.addEventListener('resize', detectKeyboard);
    
    // En iOS el evento resize puede no dispararse cuando aparece el teclado
    // así que también escuchamos los eventos de focus
    const handleFocus = () => {
      if (window.innerWidth <= 768) { // Probablemente un dispositivo móvil
        setTimeout(() => {
          setIsKeyboardVisible(true);
          scrollToBottom();
        }, 300);
      }
    };
    
    // Agregamos el listener a los campos de texto
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
    });
    
    return () => {
      window.removeEventListener('resize', detectKeyboard);
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
      });
    };
  }, [isKeyboardVisible]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Asegurarnos que el scroll se ejecuta después de que el DOM se ha actualizado
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages-container');
        if (chatContainer) {
          // Calculamos la altura total del contenedor
          const scrollHeight = chatContainer.scrollHeight;
          const clientHeight = chatContainer.clientHeight;
          
          // Hacemos scroll hacia el final
          chatContainer.scrollTop = scrollHeight - clientHeight;
        }
        
        // También usamos scrollIntoView como respaldo
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Scroll cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efecto para hacer scroll cuando cambia la visibilidad del selector
  useEffect(() => {
    if (isSelectorVisible) {
      // Cuando se muestra el selector, forzamos scroll para ver los últimos mensajes
      setTimeout(scrollToBottom, 100);
    }
  }, [isSelectorVisible]);

  // Usar un MutationObserver para detectar cambios en el contenedor de mensajes
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages-container');
    if (!chatContainer) return;

    // Configurar el observer para monitorear cambios en el contenedor de mensajes
    const observer = new MutationObserver((mutations) => {
      // Verificamos si las mutaciones son relevantes (cambios en los mensajes)
      const shouldScroll = mutations.some(mutation => 
        mutation.type === 'childList' || 
        mutation.type === 'characterData' ||
        (mutation.type === 'attributes' && mutation.attributeName === 'class')
      );
      
      if (shouldScroll) {
        // Solo hacemos scroll si el usuario ya estaba en el fondo
        // o si es un nuevo mensaje del usuario (siempre queremos ver nuestros mensajes)
        const isAtBottom = chatContainer.dataset.atBottom === 'true';
        const isNewUserMessage = mutations.some(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Intentamos detectar si se agregó un mensaje del usuario
            return Array.from(mutation.addedNodes).some(node => 
              node.nodeType === 1 && 
              (node as Element).querySelector('[class*="user"]') !== null
            );
          }
          return false;
        });
        
        if (isAtBottom || isNewUserMessage || messages.length <= 2) {
          scrollToBottom();
        }
      }
    });

    // Iniciar la observación del contenedor con opciones más específicas
    observer.observe(chatContainer, { 
      childList: true, 
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Limpieza al desmontar
    return () => observer.disconnect();
  }, [messages.length]);

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
    
    // Forzar scroll después de enviar mensaje
    setTimeout(scrollToBottom, 100);
  };

  // Función para manejar la selección de un tipo de consulta sin enviar mensaje
  const handleTypeSelection = (type: string, placeholder?: string) => {
    setActiveRequestType(type);
    // Si hay un texto de ejemplo, lo colocamos en el input como sugerencia
    if (placeholder) {
      setInputValue(placeholder);
    }
  };

  // Función para mostrar instrucciones como un mensaje del asistente
  const handleShowInstructions = (type: string, instructions: string) => {
    const newMessage = {
      id: uuidv4(),
      role: 'assistant' as 'assistant',
      content: instructions,
      timestamp: new Date(),
      requestType: type
    };
    
    // Añadimos el mensaje a la lista usando el setter del estado
    setMessages([...messages, newMessage]);
    
    // Actualizamos el tipo activo
    setActiveRequestType(type);
    
    // Forzar el scroll después de que se haya actualizado el DOM
    setTimeout(scrollToBottom, 100);
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
        <div 
          className={`flex-1 overflow-y-auto scroll-smooth ${isSelectorVisible ? 'pb-52' : 'pb-44'}`} 
          id="chat-messages-container"
          onScroll={(e) => {
            // Guardamos la posición de scroll para detectar si el usuario está al final
            const target = e.currentTarget;
            const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
            // Guardamos esta información como un atributo de datos
            target.dataset.atBottom = isAtBottom ? 'true' : 'false';
          }}
        >
          <div className="max-w-full lg:max-w-4xl mx-auto p-4 space-y-6 sm:space-y-8">
            {messages.length === 1 && (
              <QuickActions
                userName={user?.displayName}
                onActionClick={handleTypeSelection}
                onShowInstructions={handleShowInstructions}
              />
            )}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && <ChatLoader />}
            <div ref={messagesEndRef} className="h-12" id="messages-end" />
          </div>
        </div>

        {/* Input Area - Flotante SOLO en el área de chat principal */}
        <div 
          className="absolute left-0 right-0 bottom-0 z-20"
          style={{
            transition: 'transform 0.3s ease',
            transform: isKeyboardVisible ? 'translateY(-50vh)' : 'none',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
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
            onShowInstructions={handleShowInstructions}
            onTypeSelectorToggle={setIsSelectorVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;