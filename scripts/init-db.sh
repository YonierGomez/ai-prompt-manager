#!/bin/sh

echo "🚀 Iniciando configuración de base de datos..."

# Variables de entorno para Prisma - consistente con schema.prisma
export DATABASE_URL="file:./dev.db"

# Verificar si Prisma está disponible
if ! command -v npx > /dev/null 2>&1; then
    echo "❌ Error: npx no está disponible"
    exit 1
fi

# Crear directorio de base de datos si no existe y asegurar permisos
mkdir -p ./prisma
cd ./prisma

# Aplicar migraciones/schema a la base de datos
echo "🔄 Aplicando schema a la base de datos..."
npx prisma db push --force-reset --accept-data-loss

# Ejecutar seed si existe  
if [ -f "seed.ts" ]; then
    echo "🌱 Ejecutando seed de datos..."
    npx prisma db seed
else
    echo "⚠️  No se encontró archivo de seed"
fi

echo "✅ Base de datos configurada correctamente"
echo "🎉 Iniciando aplicación..."

# Volver al directorio raíz de la aplicación
cd /app

# Iniciar la aplicación Next.js en modo standalone
exec node server.js
