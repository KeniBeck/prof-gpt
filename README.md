# Mentora AI 🤖📚

**Asistente inteligente para profesores** - Una aplicación web que ayuda a los educadores con la planificación de clases, evaluaciones, actividades creativas y más.

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.3.5-green.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-blue.svg)

## 🌟 Características

- **Autenticación segura** - Validación de profesores a través de API externa
- **Chat inteligente** - Interfaz conversacional para asistencia educativa
- **Responsive Design** - Optimizado para móvil, tablet y desktop
- **Gestión de sesiones** - Verificación periódica de integridad del usuario
- **Acciones rápidas** - Plantillas predefinidas para tareas comunes

## 🚀 Funcionalidades

### 📝 Asistencia Educativa
- **Planificación de clases** - Ayuda para crear planes de lección estructurados
- **Evaluaciones** - Diseño de rúbricas y métodos de evaluación
- **Actividades grupales** - Sugerencias para dinámicas colaborativas
- **Ideas creativas** - Propuestas innovadoras para enseñanza

### 🔐 Seguridad
- Autenticación basada en email institucional
- Validación en tiempo real con servidor externo
- Verificación periódica de integridad del usuario
- Rutas protegidas con middleware de autenticación

### 💻 Experiencia de Usuario
- Interfaz moderna con Tailwind CSS
- Sidebar desplegable con historial de conversaciones
- Formularios con validación (React Hook Form + Zod)
- Estados de carga y manejo de errores

## 🛠️ Tecnologías

### Frontend
- **React 19** - Biblioteca principal de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de estilos
- **React Router DOM** - Navegación SPA

### Gestión de Estado y Formularios
- **React Context** - Manejo global del estado de autenticación
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### HTTP y Servicios
- **Axios** - Cliente HTTP para comunicación con API
- **Custom Auth Service** - Servicio de autenticación personalizado

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas específicas para TS

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── ui/                 # Componentes reutilizables
│       ├── LoginFrom.tsx   # Formulario de login
│       ├── FloatingInput.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Avatar.tsx
│       └── ScrollArea.tsx
├── context/
│   └── AuthContext.tsx     # Contexto de autenticación global
├── middleware/
│   └── ProtectedRoute.tsx  # HOC para rutas protegidas
├── services/
│   ├── authService.ts      # Servicio de autenticación
│   └── test-auth.ts        # Pruebas de autenticación
├── lib/
│   ├── useUserIntegrityCheck.ts  # Hook de verificación periódica
│   └── interface/
│       └── chat.ts         # Interfaces del chat
├── views/
│   ├── Login.tsx           # Página de login
│   ├── Home.tsx            # Página principal
│   └── Chat.tsx            # Interfaz de chat
├── assets/                 # Recursos estáticos
├── App.tsx                 # Componente principal
└── main.tsx               # Punto de entrada
```

## 🚦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd prof-gpt
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Edita `.env` con tu configuración:
```env
VITE_API_URL=http://localhost:3000
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Previsualiza build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🏗️ Build y Despliegue

### Build para Producción
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

### Despliegue
El proyecto incluye configuración para:
- **Vercel** - [`vercel.json`](vercel.json) con rewrites para SPA
- **Apache** - [`.htaccess`](.htaccess) para redirecciones

## 🔧 Configuración de API

La aplicación se comunica con una API externa para validación de usuarios:

### Endpoint de Autenticación
```
POST /microsoft-graph/validate-teacher
```

**Payload:**
```json
{
  "email": "profesor@institucio.edu"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "user": {
    "id": "123",
    "displayName": "Nombre Profesor",
    "email": "profesor@institucion.edu",
    "isTeacher": true
  }
}
```

## 🔐 Flujo de Autenticación

1. **Login** - Usuario ingresa email institucional
2. **Validación** - Se verifica con API externa
3. **Sesión** - Datos se guardan en localStorage
4. **Verificación periódica** - Se valida integridad cada 5 minutos
5. **Logout** - Limpieza de sesión local

## 🎨 Componentes Principales

### AuthContext
Maneja el estado global de autenticación:
- Validación inicial desde localStorage
- Verificación con servidor al iniciar
- Funciones de login/logout

### ProtectedRoute
Middleware para rutas que requieren autenticación:
- Verifica estado de autenticación
- Redirige a login si no autorizado
- Muestra loading durante verificación

### LoginForm
Formulario de autenticación con:
- Validación con Zod
- Estados de carga
- Manejo de errores

### Chat
Interfaz principal de conversación:
- Historial de mensajes
- Acciones rápidas predefinidas
- Sidebar responsive
- Estados de carga

## 🛡️ Seguridad

- **Validación de entrada** con Zod schemas
- **Verificación periódica** de integridad del usuario
- **Rutas protegidas** con middleware de autenticación
- **Limpieza de sesión** en caso de invalidación

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🐛 Reporte de Bugs

Si encuentras algún problema, por favor abre un [issue](../../issues) con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

## 📞 Soporte

Para soporte técnico o preguntas, contacta a través de:
- Issues del repositorio

---

**Mentora AI** - Transformando la educación con inteligencia artificial 🚀