# Docker Multi-Arquitectura

Este proyecto soporta construcción de imágenes Docker para múltiples arquitecturas, incluyendo x86_64 y ARM.

## Arquitecturas Soportadas

- **linux/amd64** - Intel/AMD x86_64 (servidores tradicionales, PC)
- **linux/arm64** - ARM 64-bit (Apple Silicon M1/M2, Raspberry Pi 4+, AWS Graviton)
- **linux/arm/v7** - ARM 32-bit (Raspberry Pi 3, dispositivos IoT)

## Construcción Local (Una Arquitectura)

Para construir solo para tu arquitectura actual:

```bash
# Construcción estándar
npm run docker:build

# O directamente con Docker
docker build -t ai-prompt-manager .
```

## Construcción Multi-Arquitectura

### Prerrequisitos

1. **Docker Buildx** (incluido en Docker Desktop)
2. **Cuenta en Docker Hub** o registry compatible (para push)

### Construcción y Publicación

```bash
# Usar el script automático
npm run docker:build-multiarch

# O manualmente
./build-multiarch.sh ai-prompt-manager latest

# Con nombre personalizado
./build-multiarch.sh mi-usuario/ai-prompt-manager v1.0.0
```

### Solo Construcción (Sin Push)

Para construir sin publicar:

```bash
docker buildx build \
    --platform linux/amd64,linux/arm64,linux/arm/v7 \
    --tag ai-prompt-manager:latest \
    .
```

## Uso de la Imagen

```bash
# Ejecutar (Docker selecciona la arquitectura correcta automáticamente)
docker run -p 3000:3000 ai-prompt-manager

# Con Docker Compose
npm run docker:up
```

## Verificación

Para verificar las arquitecturas disponibles:

```bash
docker buildx imagetools inspect ai-prompt-manager:latest
```

## Notas Técnicas

- **Node.js 24 Alpine**: Base optimizada para múltiples arquitecturas
- **Prisma**: Cliente generado específicamente para cada arquitectura
- **SQLite**: Base de datos compatible con todas las plataformas
- **Next.js**: Build optimizado automáticamente por arquitectura

## Dispositivos de Prueba

- **x86_64**: Servidores Intel/AMD, PC con Linux
- **ARM64**: Apple Silicon (M1/M2), Raspberry Pi 4+, AWS Graviton
- **ARMv7**: Raspberry Pi 3, dispositivos IoT
