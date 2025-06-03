import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ScrollArea } from "../components/ui/ScrollArea";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import {
    IoSend,
    IoAdd,
    IoMenu,
    IoSettings,
    IoLogOut,
    IoBookOutline,
    IoPeopleOutline,
    IoDocumentTextOutline,
    IoBulbOutline,
    IoClose
} from "react-icons/io5";
import type { Message, Conversation, QuickAction } from "../lib/interface/chat";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MentoraSVG from "../assets/mentora.svg";
import chatService from "../services/chatService";

const Chat = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content:
                "¡Hola! Soy tu mentor educativo. Estoy aquí para ayudarte con la planificación de clases, evaluaciones, actividades creativas y mucho más. ¿En qué puedo ayudarte hoy?",
            role: "assistant",
            timestamp: new Date(),
        },
    ]);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Cerrado por defecto en móvil
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

    const quickActions: QuickAction[] = [
        { icon: IoBookOutline, label: "Plan de Clase", prompt: "Ayúdame a crear un plan de clase para..." },
        { icon: IoDocumentTextOutline, label: "Evaluación", prompt: "Necesito crear una evaluación sobre..." },
        { icon: IoPeopleOutline, label: "Actividad Grupal", prompt: "Diseña una actividad grupal para..." },
        { icon: IoBulbOutline, label: "Idea Creativa", prompt: "Dame ideas creativas para enseñar..." },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cerrar sidebar cuando se redimensiona a móvil
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };

        if (window.innerWidth >= 1024) {
            setSidebarOpen(true); // Abierto por defecto solo en desktop
        }

        // Establecer estado inicial
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSendMessage = async (content?: string) => {
        const messageContent = content || inputValue.trim();
        if (!messageContent || !user?.email) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: messageContent,
            role: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Usar el servicio de chat real
            const response = await chatService.sendAuthenticatedMessage(
                user.email,
                messageContent
            );

            if (response.success && response.data) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: response.data.toString(), // Ajustar según la estructura de respuesta
                    role: "assistant",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                // Manejar error
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: `Lo siento, ocurrió un error: ${response.error || 'Error desconocido'}`,
                    role: "assistant",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: 'Lo siento, no pude procesar tu mensaje. Inténtalo de nuevo.',
                role: "assistant",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
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

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex h-[100dvh] sm:h-screen bg-gradient-to-br from-amber-50/50 to-red-50/20 relative">
            {/* Overlay para móvil cuando sidebar está abierto */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-full"
                    } fixed lg:fixed top-0 left-0 z-30 w-80 sm:w-72 md:w-80 
        lg:w-80 xl:w-96 h-[100dvh] sm:h-full transition-transform duration-300 ease-in-out
        bg-amber-50 border-r border-gray-200 flex flex-col`}
            >
                <div className="p-3 sm:p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <img src={MentoraSVG} alt="Mentora Logo" className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">Mentora AI</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(false)}
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

                <ScrollArea className="flex-1 p-3 sm:p-4">
                    <div className="space-y-2">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className="p-2 sm:p-3 rounded-lg hover:bg-amber-100/60 cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                            >
                                <h3 className="font-medium text-xs sm:text-sm text-gray-800 truncate">{conv.title}</h3>
                                <p className="text-xs text-gray-600 truncate mt-1">{conv.lastMessage}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatTime(conv.timestamp)}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

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
                            onClick={handleLogout}
                        >
                            <IoLogOut className="h-4 w-4 mr-2" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh] sm:h-full">
                {/* Header */}
                <div className="bg-amber-50/70 border-b border-gray-200 p-3 sm:p-4 shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
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
                            <span className="hidden sm:inline">Hola, {user?.displayName}</span>
                            <span className="sm:hidden">{user?.displayName?.split(' ')[0]}</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-2 sm:p-4 min-h-0">
                    <div className="max-w-full lg:max-w-4xl mx-auto space-y-4 sm:space-y-6">
                        {messages.length === 1 && (
                            <div className="text-center py-4 sm:py-8">
                                <div className="mb-4 sm:mb-6">
                                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
                                        ¡Bienvenido{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 px-4">
                                        Comienza una conversación seleccionando una opción
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 px-2 sm:px-0">
                                    {quickActions.map((action, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-1 sm:space-y-2 
                             hover:bg-red-50 hover:border-red-200 bg-amber-50/70 text-xs sm:text-sm"
                                            onClick={() => handleSendMessage(action.prompt)}
                                        >
                                            <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                                            <span className="font-medium text-center leading-tight">{action.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`flex space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                                        }`}
                                >
                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                                        <AvatarFallback
                                            className={`text-xs sm:text-sm ${message.role === "user" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
                                        >
                                            {message.role === "user" ? "P" : "M"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`rounded-lg p-3 sm:p-4 ${message.role === "user" ? "bg-red-600 text-white" : "bg-amber-50 border border-gray-200"
                                            }`}
                                    >
                                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                        <p className={`text-xs mt-2 ${message.role === "user" ? "text-red-200" : "text-gray-500"}`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex space-x-2 sm:space-x-3 max-w-3xl">
                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                        <AvatarFallback className="bg-green-600 text-white text-xs sm:text-sm">M</AvatarFallback>
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
                <div className="bg-amber-50/70 border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
                    <div className="max-w-full lg:max-w-4xl mx-auto">
                        <div className="flex space-x-2 sm:space-x-3">
                            <div className="flex-1 relative">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Escribe tu pregunta..."
                                    className="pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base 
                         border-gray-300 focus:border-red-500 focus:ring-red-500 bg-amber-50/70"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputValue.trim() || isLoading}
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
            </div>
        </div>
    );
};

export default Chat;