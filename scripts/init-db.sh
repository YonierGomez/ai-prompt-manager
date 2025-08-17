#!/bin/sh

echo "🚀 Iniciando configuración de base de datos..."

# Variables de entorno para Prisma - usando el directorio persistente
export DATABASE_URL="file:./data/dev.db"

# Verificar si Prisma está disponible
if ! command -v npx > /dev/null 2>&1; then
    echo "❌ Error: npx no está disponible"
    exit 1
fi

# Crear directorio de base de datos persistente si no existe
mkdir -p ./data

# Verificar si la base de datos ya existe
if [ -f "./data/dev.db" ]; then
    echo "📊 Base de datos existente encontrada - conservando datos"
    echo "🔄 Verificando schema..."
    npx prisma db push
else
    echo "🆕 Creando nueva base de datos..."
    # Aplicar migraciones/schema a la base de datos
    echo "🔄 Aplicando schema a la base de datos..."
    npx prisma db push --force-reset --accept-data-loss
    
    # Ejecutar seed si existe y es una nueva base de datos
    if [ -f "./prisma/seed.ts" ]; then
        echo "🌱 Ejecutando seed de datos..."
        npx prisma db seed
    else
        echo "⚠️  No se encontró archivo de seed"
    fi
fi

echo "✅ Base de datos configurada correctamente"
echo "🎉 Iniciando aplicación..."

# Volver al directorio raíz de la aplicación
cd /app

# Iniciar la aplicación Next.js en modo standalone
exec node server.js
