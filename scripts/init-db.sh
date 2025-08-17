#!/bin/sh

echo "🚀 Iniciando configuración de base de datos..."

# Variables de entorno para Prisma
export PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node
export DATABASE_URL="file:./prisma/dev.db"

# Verificar si Prisma está disponible
if ! command -v npx > /dev/null 2>&1; then
    echo "❌ Error: npx no está disponible"
    exit 1
fi

# Crear directorio de base de datos si no existe
mkdir -p ./prisma

# Generar cliente de Prisma solo si es necesario
echo "📦 Verificando cliente de Prisma..."
if [ ! -d "./node_modules/.prisma/client" ]; then
    echo "Generando cliente de Prisma..."
    npx prisma generate --schema=./prisma/schema.prisma
fi

# Aplicar migraciones/schema a la base de datos
echo "🔄 Aplicando schema a la base de datos..."
npx prisma db push --force-reset --schema=./prisma/schema.prisma --accept-data-loss

# Ejecutar seed si existe
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Ejecutando seed de datos..."
    npx prisma db seed --schema=./prisma/schema.prisma
else
    echo "⚠️  No se encontró archivo de seed"
fi

echo "✅ Base de datos configurada correctamente"

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec node server.js
