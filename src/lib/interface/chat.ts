export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  prompt: string;
}

export interface ChatServiceRequest {
  usuario: string;
  pregunta: string;
}

export interface ChatServiceResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
