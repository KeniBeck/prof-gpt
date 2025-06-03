import React from "react";
import { Button } from "../ui/Button";
import {
  IoBookOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoBulbOutline,
} from "react-icons/io5";
import type { QuickAction } from "../../lib/interface/chat";

interface QuickActionsProps {
  userName?: string;
  onActionClick: (prompt: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userName,
  onActionClick,
}) => {
  const quickActions: QuickAction[] = [
    {
      icon: IoBookOutline,
      label: "Plan de Clase",
      prompt: "Ayúdame a crear un plan de clase para...",
    },
    {
      icon: IoDocumentTextOutline,
      label: "Evaluación",
      prompt: "Necesito crear una evaluación sobre...",
    },
    {
      icon: IoPeopleOutline,
      label: "Actividad Grupal",
      prompt: "Diseña una actividad grupal para...",
    },
    {
      icon: IoBulbOutline,
      label: "Idea Creativa",
      prompt: "Dame ideas creativas para enseñar...",
    },
  ];

  return (
    <div className="text-center py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">
          ¡Bienvenido{userName ? `, ${userName.split(" ")[0]}` : ""}!
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
            onClick={() => onActionClick(action.prompt)}
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