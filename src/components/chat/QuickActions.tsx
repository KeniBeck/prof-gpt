import React from "react";
import { Button } from "../ui/Button";
import {
  IoBookOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoAnalyticsOutline,
} from "react-icons/io5";
import type { QuickAction } from "../../lib/interface/chat";
import { ChatRequestType } from "../../services/chatService";
import { quickActionInstructions } from "../../lib/helpers/quickActionInstructions";

interface QuickActionsProps {
  userName?: string;
  onActionClick: (type: string, placeholder?: string) => void;
  onShowInstructions?: (type: string, instructions: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userName,
  onActionClick,
  onShowInstructions,
}) => {
  const quickActions: QuickAction[] = [
    {
      icon: IoBookOutline,
      label: "Planificador",
      prompt: "Genera la planificación de la clase 1 de semana 2 unidad 4 para física fundamental de 12th",
      type: ChatRequestType.PLANIFICADOR,
    },
    {
      icon: IoDocumentTextOutline,
      label: "Integrador",
      prompt: "Genera la clase 1 de semana 2 unidad 3 para Comunicación y Lenguaje de 6th para PIT.",
      type: ChatRequestType.INTEGRADOR,
    },
    {
      icon: IoPeopleOutline,
      label: "Adecuación",
      prompt: "Genera una adecuación pedagógica para Sofía Gómez de 3rd en lectura, con necesidad de instrucciones simplificadas y apoyo visual.",
      type: ChatRequestType.ADECUACION,
    },
    {
      icon: IoAnalyticsOutline,
      label: "Seguimiento",
      prompt: "¿Qué contenidos declarativos se han cubierto en matemática de 12th?",
      type: ChatRequestType.SEGUIMIENTO,
    },
  ];

  return (
    <div className="text-center py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
          ¡Bienvenid{userName ? `@, ${userName.split(" ")[0]}` : "@"}!
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          Selecciona una opción para comenzar
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 px-2 sm:px-0">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-1 sm:space-y-2 
                     hover:bg-red-50 hover:border-red-200 bg-amber-50/70 text-xs sm:text-sm"
            onClick={() => {
              // Seleccionar el tipo de acción
              onActionClick(action.type || '', '');
              
              // Si existe la función para mostrar instrucciones, llamarla
              if (onShowInstructions && action.type) {
                const actionType = action.type as keyof typeof quickActionInstructions;
                const instructions = quickActionInstructions[actionType] || 
                  'Escribe tu consulta específica para esta acción.';
                onShowInstructions(action.type, instructions);
              }
            }}
          >
            <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            <span className="font-medium text-center leading-tight">
              {action.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;