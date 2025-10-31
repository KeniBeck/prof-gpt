import { ChatRequestType } from "../../services/chatService";

export const quickActionInstructions = {
  [ChatRequestType.PLANIFICADOR]: 
    "**Planificador**\n\nPara generar una planificación, necesito que me brindes los siguientes datos:\n\n- Grado (ej: 12th, kinder)\n- Área (ej: Matemática, Literature & Vocabulary)\n- Unidad (ej: unidad 4, quarter 3)\n- [Opcional] Observaciones adicionales\n\nEjemplo: \"Genera la planificación de la semana 2 unidad 4 para física fundamental de 12th [cerrando con una prueba corta]\"",
  
  [ChatRequestType.RECURSOS]:
    "**Recursos**\n\nPara generar un recurso, necesito que me brindes los siguientes datos:\n\n- Grado (ej: 12th, kinder)\n- Área (ej: Matemática, Literature & Vocabulary)\n- Unidad (ej: unidad 4, quarter 3)\n- Tipo de recurso: evaluación, hoja de trabajo, presentación.\n- [Opcional] Observaciones adicionales\n\nEjemplo: \"Genera una hoja de trabajo para la semana 4 unidad 2 de matemática de 2nd [con diez ejercicios de aplicaciones prácticas]\"",
  
  [ChatRequestType.ADECUACION]:
    "**Adecuación**\n\nPara generar una adecuación pedagógica para un estudiante con necesidades específicas, necesito que me brindes los siguientes datos:\n\n- Correo del estudiante (ej: sofia.gomez@ameritec.edu.gt)\n- NEE (tipo de necesidad educativa especial, ej: dificultades en la comprensión lectora, necesidad de instrucciones simplificadas)\n- Dx (diagnóstico, ej: TDAH, dislexia, trastorno del lenguaje expresivo)\n\nEjemplo: \"Genera una adecuación pedagógica para sofia.gomez@ameritec.edu.gt, con necesidad de apoyo visual y seguimiento personalizado. Dx: TDAH.\"",
  
  [ChatRequestType.SEGUIMIENTO]:
    "**Seguimiento**\n\nPara consultar el avance de las planificaciones generadas en Mentora, necesito que me brindes uno de los siguientes datos:\n- Correo del docente (ej: juan.perez@mentora.edu.gt)\no bien\n- Grado y área (ej: 12th Matemática, 3rd Comunicación y Lenguaje)\n\nEjemplo:\n\"¿Qué planificaciones ha generado juan.perez@mentora.edu.gt?\"\n\"¿Cuál es el avance de planificación en Matemática de 12th?\"",
  
  [ChatRequestType.GESTION]:
    "**Gestión de Archivo Excel**\n\nPara procesar un archivo Excel, por favor carga el archivo que deseas validar.\n\nEl archivo debe ser en formato .xlsx y se enviará en base64 al sistema.\n\n- Usuario (correo electrónico)\n- Nombre del archivo (ej: plan_12th_matematica.xlsx)\nFlujo esperado:\n- Si el archivo es válido, recibirás un mensaje de éxito.\n- Si hay errores, recibirás un archivo Excel con los errores encontrados.\n\nEjemplo: Carga tu archivo y presiona 'Procesar'."
};
