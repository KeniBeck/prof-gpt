import { ChatRequestType } from "../../services/chatService";

export const quickActionInstructions = {
  [ChatRequestType.PLANIFICADOR]: 
    "**Planificador**\n\nPara generar una planificación, necesito que me brindes los siguientes datos:\n\n- Grado (ej: 12th, kinder)\n- Área (ej: Matemática, Literature & Vocabulary)\n- Unidad (ej: unidad 4, quarter 3)\n- Clase (ej: clase 1, clase 2)\n- [Opcional] Observaciones adicionales\n\nEjemplo: \"Genera la planificación de la clase 1 de semana 2 unidad 4 para física fundamental de 12th [cerrando con una prueba corta]\"",
  
  [ChatRequestType.INTEGRADOR]:
    "**Integrador**\n\nPara generar una planificación de Proyecto Integrador, necesito que me brindes los siguientes datos:\n\n- Grado (ej: 12th, kinder)\n- Área (ej: Matemática, Literature & Vocabulary)\n- Unidad (ej: unidad 4, quarter 3)\n- Clase (ej: clase 1, clase 2)\n- Proyecto (ej: PIT, PSA)\n- [Opcional] Observaciones adicionales\n\nEjemplo: \"Genera la planificación de la clase 1 de semana 2 unidad 3 para comunicación y lenguaje de 6th para PIT.\"",
  
  [ChatRequestType.ADECUACION]:
    "**Adecuación**\n\nPara generar una adecuación pedagógica para un estudiante con necesidades específicas, necesito que me brindes los siguientes datos:\n\n- Correo del estudiante (ej: sofia.gomez@ameritec.edu.gt)\n- NEE (tipo de necesidad educativa especial, ej: dificultades en la comprensión lectora, necesidad de instrucciones simplificadas)\n- Dx (diagnóstico, ej: TDAH, dislexia, trastorno del lenguaje expresivo)\n\nEjemplo: \"Genera una adecuación pedagógica para sofia.gomez@ameritec.edu.gt, con necesidad de apoyo visual y seguimiento personalizado. Dx: TDAH.\"",
  
  [ChatRequestType.SEGUIMIENTO]:
    "**Seguimiento**\n\nPara consultar el avance de las planificaciones generadas en Mentora, necesito que me brindes uno de los siguientes datos:\n- Correo del docente (ej: juan.perez@mentora.edu.gt)\no bien\n- Grado y área (ej: 12th Matemática, 3rd Comunicación y Lenguaje)\n\nEjemplo:\n\"¿Qué planificaciones ha generado juan.perez@mentora.edu.gt?\"\n\"¿Cuál es el avance de planificación en Matemática de 12th?\""
};
