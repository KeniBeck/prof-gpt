import React from "react";
import { Button } from "../ui/Button";
import {
  IoBookOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoAnalyticsOutline,
} from "react-icons/io5";
import { MdOutlineHandyman } from "react-icons/md";
import { ChatRequestType } from "../../services/chatService";

interface TypeSelectorProps {
  activeType: string;
  onTypeSelect: (type: string) => void;
  compact?: boolean;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ 
  activeType, 
  onTypeSelect,
  compact = false 
}) => {
  const types = [
    {
      type: ChatRequestType.PLANIFICADOR,
      icon: IoBookOutline,
      label: "Planificador",
    },
    {
      type: ChatRequestType.INTEGRADOR,
      icon: IoDocumentTextOutline,
      label: "Integrador",
    },
    {
      type: ChatRequestType.ADECUACION,
      icon: IoPeopleOutline,
      label: "Adecuación",
    },
    {
      type: ChatRequestType.SEGUIMIENTO,
      icon: IoAnalyticsOutline,
      label: "Seguimiento",
    },
    {
      type: ChatRequestType.GESTION,
      icon: MdOutlineHandyman,
      label: "Gestión",
    },
  ];

  return (
    <div className={`flex flex-wrap ${compact ? 'justify-start gap-1 mb-0' : 'justify-center gap-1 mb-2'}`}>
      {types.map((item) => (
        <Button
          key={item.type}
          variant={activeType === item.type ? "default" : "outline"}
          size="sm"
          className={`${compact ? 'text-[10px] p-0.5 min-w-0 h-6' : 'text-xs'} flex items-center gap-1 ${
            activeType === item.type 
              ? "bg-red-600 hover:bg-red-700" 
              : "bg-amber-50/70 hover:bg-red-50 text-gray-700"
          }`}
          onClick={() => onTypeSelect(item.type)}
        >
          <item.icon className={compact ? "h-2.5 w-2.5 mr-0.5" : "h-3 w-3"} />
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default TypeSelector;
