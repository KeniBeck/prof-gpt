import { ChatRequestType } from "../../services/chatService";

export const quickActionInstructions = {
  [ChatRequestType.PLANIFICADOR]: 
    "**Planificador**\n\nPara generar una planificación, necesito que me brindes los siguientes datos:\n\n- Grado (ej: 12th, kinder)\n- Área (ej: matematica, literature / vocabulary)\n- Unidad (ej: unidad 4, quarter 3)\n- Semana (ej: semana 2, week 8)\n- [Opcional] Observaciones adicionales\n\nEjemplo:\n\"Genera la planificación de la semana 2 unidad 4 para física fundamental de 12th [cerrando con una prueba corta]\"",
  
  [ChatRequestType.RECURSOS]:
    "**Recursos**\n\nPara generar un recurso, necesito que me brindes los siguientes datos:\n\n•Grado (ej: 12th, kinder)\n•Área (ej: Matemática, Literature & Vocabulary)\n•Unidad (ej: unidad 4, quarter 3)\n•Semana (ej: semana 2, week 8)\n•Tipo de recurso(ej: evaluacion, quiz, ejercitacion, worksheet, presentacion, lecture) \n•[Opcional] Observaciones adicionales\n\nEjemplo:\n\"Genera una hoja de trabajo de la semana 4 unidad 2 de matemática de 2nd [con diez ejercicios de aplicaciones prácticas]\"",
  
  [ChatRequestType.ADECUACION]:
    "**Adecuación**\n\nPara generar una adecuación pedagógica para un estudiante con necesidades específicas, necesito que me brindes los siguientes datos:\n\n- Correo del estudiante (ej: sofia.gomez@ameritec.edu.gt)\n- NEE (tipo de necesidad educativa especial, ej: dificultades en la comprensión lectora, necesidad de instrucciones simplificadas)\n- Dx (diagnóstico, ej: TDAH, dislexia, trastorno del lenguaje expresivo)\n\nEjemplo:\n\"Genera una adecuación pedagógica para sofia.gomez@ameritec.edu.gt, con necesidad de apoyo visual y seguimiento personalizado. Dx: TDAH.\"",
  
  [ChatRequestType.SEGUIMIENTO]:
    "**Seguimiento**\n\nPara consultar el avance de las planificaciones generadas en Mentora, necesito que me brindes uno de los siguientes datos:\n- Correo del docente (ej: juan.perez@mentora.edu.gt)\no bien\n- Grado y área (ej: 12th Matemática, 3rd Comunicación y Lenguaje)\n\nEjemplo:\n\"¿Qué planificaciones ha generado juan.perez@mentora.edu.gt?\"\n\"¿Cuál es el avance de planificación en Matemática de 12th?\"",
  
  [ChatRequestType.GESTION]:
    "**Gestión de Archivo Excel**\n\nPara procesar un archivo, asegúrate de cargarlo con el formato de nombre correspondiente:\n\n- Planificación (ej: plan_12th_matematica.xlsx)\n- Plantillas de clase (ej: mentora_plantillas_planificacion.xlsx)\n- Pénsum (ej: mentora_pensum.xlsx)\n\nEjemplo:\nCarga tu archivo y presiona 'Enviar archivo Excel'."
};
