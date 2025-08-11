# Contributing to AI Prompt Manager

¡Gracias por tu interés en contribuir al AI Prompt Manager! 🚀

## 🤝 Cómo Contribuir

### 1. **Reportar Bugs**
- Usa el [issue tracker](https://github.com/yourusername/ai-prompt-manager/issues)
- Describe claramente el problema
- Incluye pasos para reproducir el bug
- Especifica tu entorno (OS, navegador, versión)

### 2. **Solicitar Features**
- Abre un issue con el label "enhancement"
- Describe la funcionalidad deseada
- Explica por qué sería útil
- Proporciona ejemplos de uso

### 3. **Enviar Pull Requests**

#### Setup del Proyecto
```bash
# Fork y clonar el repositorio
git clone https://github.com/yourusername/ai-prompt-manager.git
cd ai-prompt-manager

# Instalar dependencias
npm install

# Configurar base de datos
npm run db:generate
npm run db:push
npm run db:seed

# Iniciar desarrollo
npm run dev
```

#### Flujo de Trabajo
1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz tus cambios siguiendo las convenciones de código
3. Ejecuta tests: `npm run lint`
4. Commit con mensajes descriptivos
5. Push a tu fork: `git push origin feature/nueva-funcionalidad`
6. Abre un Pull Request

## 📋 Guías de Estilo

### **Código TypeScript/React**
- Usa TypeScript estricto
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Nombres descriptivos en camelCase

### **Commits**
```
feat: agregar funcionalidad de exportación
fix: corregir error en vista de favoritos
docs: actualizar README con nuevas instrucciones
style: mejorar diseño de cards de prompt
refactor: optimizar hook usePrompts
test: agregar tests para componente PromptCard
```

### **Branches**
- `main` - código estable
- `develop` - desarrollo activo
- `feature/nombre` - nuevas funcionalidades
- `fix/nombre` - corrección de bugs
- `hotfix/nombre` - fixes críticos

## 🎯 Áreas de Contribución

### **Frontend**
- Nuevos componentes UI
- Mejoras de UX/UI
- Optimizaciones de performance
- Responsive design

### **Backend**
- APIs REST
- Optimización de queries
- Nuevas funcionalidades de base de datos
- Integración con servicios externos

### **DevOps**
- Mejoras en Docker
- CI/CD pipelines
- Optimización de builds
- Deployment scripts

### **Documentación**
- Guías de usuario
- Documentación técnica
- Ejemplos de código
- Tutoriales

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Build de producción
npm run build

# Test en Docker
docker build -t ai-prompt-manager-test .
docker run -p 3001:3000 ai-prompt-manager-test
```

## 📝 Código de Conducta

- Sé respetuoso y constructivo
- Acepta feedback y críticas constructivas
- Ayuda a otros contribuyentes
- Mantén un ambiente inclusivo

## 🎉 Reconocimiento

Los contribuyentes serán listados en:
- README.md
- CONTRIBUTORS.md
- Release notes

## 📞 Contacto

- **Autor**: Yonier Asprilla
- **Website**: [https://yonier.com](https://yonier.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-prompt-manager/issues)

---

¡Esperamos tus contribuciones! 🌟
