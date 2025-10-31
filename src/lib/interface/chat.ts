export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  fileBlob?: Blob;
  fileName?: string;
  requestType?: string;
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
  type?: string; // Tipo de consulta: planificador, integrador, adecuacion, seguimiento
}

export interface ChatServiceResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
