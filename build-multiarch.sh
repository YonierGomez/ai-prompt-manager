#!/bin/bash

# Script para construir imagen Docker multi-arquitectura
# Soporta x86_64, ARM64 y ARMv7

set -e

IMAGE_NAME=${1:-"ai-prompt-manager"}
TAG=${2:-"latest"}
FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"

echo "🚀 Construyendo imagen multi-arquitectura: $FULL_IMAGE_NAME"

# Verificar si buildx está disponible
if ! docker buildx version > /dev/null 2>&1; then
    echo "❌ Error: Docker Buildx no está disponible"
    echo "   Instala Docker Desktop o habilita buildx en tu instalación de Docker"
    exit 1
fi

# Crear un nuevo builder si no existe
BUILDER_NAME="multiarch-builder"
if ! docker buildx inspect $BUILDER_NAME > /dev/null 2>&1; then
    echo "📦 Creando nuevo builder multi-arquitectura..."
    docker buildx create --name $BUILDER_NAME --platform linux/amd64,linux/arm64,linux/arm/v7 --use
    docker buildx inspect --bootstrap
fi

# Usar el builder multi-arquitectura
docker buildx use $BUILDER_NAME

echo "🔨 Construyendo para las siguientes plataformas:"
echo "   - linux/amd64 (x86_64)"
echo "   - linux/arm64 (ARM 64-bit)"
echo "   - linux/arm/v7 (ARM 32-bit)"

# Construir la imagen para múltiples arquitecturas
docker buildx build \
    --platform linux/amd64,linux/arm64,linux/arm/v7 \
    --tag $FULL_IMAGE_NAME \
    --push \
    .

echo "✅ Imagen multi-arquitectura construida exitosamente: $FULL_IMAGE_NAME"
echo ""
echo "📋 Para usar la imagen:"
echo "   docker run -p 3000:3000 $FULL_IMAGE_NAME"
echo ""
echo "🔍 Para verificar las arquitecturas soportadas:"
echo "   docker buildx imagetools inspect $FULL_IMAGE_NAME"
