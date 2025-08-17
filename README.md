# 🚀 AI Prompt Manager

Una aplicación web moderna e impresionante para gestionar, organizar y optimizar tus prompts de inteligencia artificial. Construida con las últimas tecnologías web y diseñada para maximizar tu productividad con IA.

![AI Prompt Manager](./public/screenshot.png)

## ✨ Características Principales

### 🎯 **Gestión Completa de Prompts**
- **Crear, editar y eliminar** prompts personalizados
- **Organización por categorías** (Escritura, Programación, Análisis, etc.)
- **Sistema de etiquetas** flexible para clasificación avanzada
- **Búsqueda inteligente** con filtros múltiples

### 💖 **Experiencia de Usuario Superior**
- **Diseño moderno** con modo claro/oscuro
- **Interfaz responsiva** optimizada para todos los dispositivos
- **Animaciones suaves** con Framer Motion
- **Vista previa en tiempo real** al crear prompts

### 🤖 **Soporte Multi-IA**
- **Compatibilidad completa** con GPT-4, Claude, Gemini, Llama y más
- **Identificación visual** por modelo de IA
- **Optimización específica** para cada plataforma

### 📊 **Analytics y Estadísticas**
- **Dashboard completo** con métricas de uso
- **Tracking de favoritos** y prompts más utilizados
- **Análisis por categorías** y tendencias de uso
- **Historial de actividad** detallado

### 🔧 **Funcionalidades Avanzadas**
- **Copia rápida** al portapapeles
- **Sistema de favoritos** para acceso rápido
- **Exportar/Importar** colecciones de prompts
- **Modo privado** para prompts confidenciales

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Next.js 15** - Framework React de última generación
- **TypeScript** - Desarrollo con tipos estáticos
- **Tailwind CSS** - Styling utility-first
- **Radix UI** - Componentes accesibles primitivos
- **Framer Motion** - Animaciones fluidas
- **Lucide Icons** - Iconografía moderna

### **Backend & Base de Datos**
- **Prisma ORM** - Gestión de base de datos type-safe
- **SQLite** - Base de datos embebida para desarrollo
- **Next.js API Routes** - Endpoints RESTful integrados
- **Zod** - Validación de schemas

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **TypeScript** - Verificación de tipos
- **Git** - Control de versiones

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Git

### **Instalación**

```bash
# Clonar el repositorio
git clone <repository-url>
cd ai-prompt-manager

# Instalar dependencias
npm install

# Configurar la base de datos
npm run db:generate
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📖 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter

# Base de Datos
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Aplicar cambios al schema
npm run db:seed      # Poblar con datos de ejemplo
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Resetear y repoblar DB
```

## 🐳 Despliegue con Docker

### **Configuración Básica**

Para ejecutar la aplicación con Docker y mantener tus prompts persistentes:

```bash
# Clonar el repositorio
git clone https://github.com/YonierGomez/ai-prompt-manager.git
cd ai-prompt-manager

# Ejecutar con Docker Compose
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:3000`

### **Persistencia de Datos**

Los datos se almacenan en **volúmenes Docker nombrados** que persisten entre reconstrucciones:

- `ai_prompt_data`: Base de datos SQLite con todos tus prompts
- `ai_prompt_uploads`: Archivos subidos (futuras funcionalidades)

### **Gestión de Volúmenes**

Usa el script incluido para gestionar tus datos:

```bash
# Ver estado de los volúmenes
./scripts/docker-volumes.sh status

# Crear backup de tus datos
./scripts/docker-volumes.sh backup

# Restaurar desde backup
./scripts/docker-volumes.sh restore ai-prompt-backup-20241217-143000.tar.gz

# Listar volúmenes existentes
./scripts/docker-volumes.sh list

# Limpiar volúmenes no utilizados
./scripts/docker-volumes.sh clean

# Resetear completamente (¡PELIGROSO!)
./scripts/docker-volumes.sh reset
```

### **Actualizaciones**

Para actualizar la aplicación sin perder datos:

```bash
# Detener contenedores
docker-compose down

# Actualizar código
git pull

# Reconstruir y ejecutar (los datos se mantienen)
docker-compose up -d --build
```

### **Troubleshooting Docker**

**Problema: Los prompts desaparecen después de reconstruir**
```bash
# Verificar que los volúmenes existen
docker volume ls | grep ai_prompt

# Verificar el estado de los volúmenes
./scripts/docker-volumes.sh status
```

**Problema: Permisos de base de datos**
```bash
# Reiniciar contenedores con configuración limpia
docker-compose down
docker-compose up -d
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── categories/        # Páginas de categorías
│   ├── favorites/         # Página de favoritos
│   ├── new/              # Crear nuevo prompt
│   ├── prompts/          # Páginas de prompts individuales
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── navbar.tsx        # Navegación principal
│   ├── prompt-card.tsx   # Tarjeta de prompt
│   ├── stats-card.tsx    # Tarjeta de estadísticas
│   └── quick-actions.tsx # Acciones rápidas
├── hooks/                # Custom hooks
│   └── usePrompts.ts     # Hook para gestión de prompts
├── lib/                  # Utilidades y configuración
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Funciones utilitarias
└── types/                # Definiciones de tipos TypeScript
```

## 🎨 Características de Diseño

### **Sistema de Colores**
- **Modo Claro/Oscuro** automático basado en preferencias del sistema
- **Colores semánticos** para categorías y estados
- **Gradientes modernos** para elementos destacados

### **Tipografía**
- **Inter** como fuente principal para legibilidad óptima
- **Jerarquía visual** clara con diferentes pesos y tamaños

### **Componentes**
- **Design System** consistente con Radix UI
- **Componentes reutilizables** para mantenimiento eficiente
- **Animaciones contextuales** que mejoran la UX

## 📊 Estructura de Datos

### **Prompt Schema**
```typescript
interface Prompt {
  id: string
  title: string
  content: string
  description?: string
  category: string
  tags: string[]
  aiModel: string
  isFavorite: boolean
  isPrivate: boolean
  usageCount: number
  createdAt: Date
  updatedAt: Date
}
```

### **Categorías Predefinidas**
- 📝 **Escritura** - Contenido, copywriting, redacción
- 💻 **Programación** - Code review, debugging, desarrollo
- 📈 **Análisis** - Datos, insights, business intelligence
- 🎨 **Creatividad** - Brainstorming, ideación, diseño
- ⚡ **Productividad** - Optimización, gestión del tiempo
- 🎓 **Educación** - Tutoriales, aprendizaje, metodologías
- 📢 **Marketing** - Estrategias, growth, ventas
- 🔍 **Investigación** - Research, análisis de mercado

## 🌟 Características Avanzadas

### **Sistema de Búsqueda**
- Búsqueda en tiempo real por título, descripción y contenido
- Filtros por categoría, modelo de IA y favoritos
- Búsqueda inteligente en tags

### **Gestión de Estado**
- Custom hooks para manejo eficiente del estado
- Optimistic updates para mejor UX
- Error handling robusto

### **Performance**
- Lazy loading de componentes
- Optimización de imágenes automática
- Minimización de re-renders

## 🔮 Roadmap Futuro

### **v2.0 - Colaboración**
- [ ] Compartir prompts públicamente
- [ ] Comentarios y valoraciones
- [ ] Comunidad de usuarios

### **v2.1 - Integración IA**
- [ ] Generación automática de prompts
- [ ] Sugerencias basadas en IA
- [ ] Optimización automática de prompts

### **v2.2 - Analytics Avanzado**
- [ ] Métricas detalladas de rendimiento
- [ ] A/B testing de prompts
- [ ] Insights de uso avanzados

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Yonier Asprilla**
- Website: [https://yonier.com](https://yonier.com)
- GitHub: [@yonier](https://github.com/yonier)

Creado con ❤️ y mucha dedicación para la comunidad de desarrolladores.

---

**¿Te gusta el proyecto? ⭐ Dale una estrella en GitHub!**

Para más información o soporte, visita [https://yonier.com](https://yonier.com) o contacta conmigo directamente.
