#!/bin/sh

echo "🚀 Iniciando configuración de base de datos..."

# Variables de entorno para Prisma
export DATABASE_URL="file:./prisma/dev.db"

# Verificar si Prisma está disponible
if ! command -v npx > /dev/null 2>&1; then
    echo "❌ Error: npx no está disponible"
    exit 1
fi

# Crear directorio de base de datos si no existe
mkdir -p ./prisma

# Aplicar migraciones/schema a la base de datos
echo "🔄 Aplicando schema a la base de datos..."
npx prisma db push --force-reset --accept-data-loss

# Ejecutar seed si existe
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Ejecutando seed de datos..."
    npx prisma db seed
else
    echo "⚠️  No se encontró archivo de seed"
fi

echo "✅ Base de datos configurada correctamente"

# Iniciar la aplicación
echo "🚀 Iniciando aplicación..."
exec node server.js
