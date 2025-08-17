#!/bin/sh

echo "🚀 Iniciando configuración de base de datos..."

# Verificar si Prisma está disponible
if ! command -v npx > /dev/null 2>&1; then
    echo "❌ Error: npx no está disponible"
    exit 1
fi

# Generar cliente de Prisma
echo "📦 Generando cliente de Prisma..."
npx prisma generate

# Aplicar migraciones/schema a la base de datos
echo "🔄 Aplicando schema a la base de datos..."
npx prisma db push --force-reset

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
