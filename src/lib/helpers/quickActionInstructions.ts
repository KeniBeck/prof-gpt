import { ChatRequestType } from "../../services/chatService";

export const quickActionInstructions = {
  [ChatRequestType.PLANIFICADOR]: 
    "**Planificador de Clases**\n\nPuedes pedirme que genere planificaciones de clase completas. Para mejores resultados, especifica:\n\n- Grado o nivel (ej: 12th, 3rd, secundaria)\n- Asignatura (ej: Matemáticas, Lenguaje, Ciencias)\n- Unidad y número de clase (ej: unidad 4, clase 1)\n- Cualquier detalle adicional que necesites incluir\n\nEjemplo: \"Genera la planificación de la clase 1 de semana 2 unidad 4 para física fundamental de 12th\"",
  
  [ChatRequestType.INTEGRADOR]:
    "**Integrador de Contenidos**\n\nPuedes pedirme que genere clases completas con contenidos integrados y actividades. Especifica:\n\n- Grado o nivel (ej: 6th, 9th, bachillerato)\n- Asignatura (ej: Comunicación y Lenguaje, Matemáticas)\n- Unidad, semana y número de clase\n- Si es para PIT u otro programa especial\n\nEjemplo: \"Genera la clase 1 de semana 2 unidad 3 para Comunicación y Lenguaje de 6th para PIT.\"",
  
  [ChatRequestType.ADECUACION]:
    "**Adecuación Pedagógica**\n\nPuedes pedirme que genere adecuaciones pedagógicas para estudiantes con necesidades específicas. Incluye:\n\n- Nombre del estudiante\n- Grado (ej: 3rd, 7th)\n- Área académica (ej: lectura, matemáticas)\n- Tipo de necesidad o apoyo requerido\n\nEjemplo: \"Genera una adecuación pedagógica para Sofía Gómez de 3rd en lectura, con necesidad de instrucciones simplificadas y apoyo visual.\"",
  
  [ChatRequestType.SEGUIMIENTO]:
    "**Seguimiento Académico**\n\nPuedes consultarme sobre el seguimiento de contenidos, evaluaciones o progreso en diferentes áreas. Especifica:\n\n- Asignatura o área académica\n- Grado o nivel\n- Tipo de contenido (declarativo, procedimental, actitudinal)\n- Período de tiempo o unidad específica\n\nEjemplo: \"¿Qué contenidos declarativos se han cubierto en matemática de 12th?\""
};
