#!/bin/sh

echo "🚀 Iniciando configuración de base de datos..."

# Detectar si estamos usando docker-compose (con volumen en /app/prisma) o configuración local
if [ -d "/app/prisma" ] && [ -w "/app/prisma" ]; then
    # Configuración para docker-compose con volumen en /app/prisma
    export DATABASE_URL="file:./prisma/dev.db"
    DB_DIR="./prisma"
    DB_FILE="./prisma/dev.db"
    echo "📁 Usando configuración de docker-compose: ${DATABASE_URL}"
else
    # Configuración local con directorio ./data
    export DATABASE_URL="file:./data/dev.db"
    DB_DIR="./data"
    DB_FILE="./data/dev.db"
    echo "📁 Usando configuración local: ${DATABASE_URL}"
fi

# Verificar si Prisma está disponible
if ! command -v npx > /dev/null 2>&1; then
    echo "❌ Error: npx no está disponible"
    exit 1
fi

# Crear directorio de base de datos persistente si no existe
echo "📂 Creando directorio: ${DB_DIR}"
mkdir -p "${DB_DIR}"

# Verificar permisos de escritura
if [ ! -w "${DB_DIR}" ]; then
    echo "❌ Error: No hay permisos de escritura en ${DB_DIR}"
    ls -la "${DB_DIR}"
    exit 1
fi

# Verificar si la base de datos ya existe
if [ -f "${DB_FILE}" ]; then
    echo "📊 Base de datos existente encontrada en: ${DB_FILE}"
    echo "🔄 Verificando schema..."
    npx prisma db push --accept-data-loss
else
    echo "🆕 Creando nueva base de datos en: ${DB_FILE}"
    # Aplicar migraciones/schema a la base de datos
    echo "🔄 Aplicando schema a la base de datos..."
    npx prisma db push --force-reset --accept-data-loss
    
    # Verificar que la base de datos se creó correctamente
    if [ ! -f "${DB_FILE}" ]; then
        echo "❌ Error: No se pudo crear la base de datos en ${DB_FILE}"
        ls -la "${DB_DIR}"
        exit 1
    fi
    
    # Ejecutar seed si existe y es una nueva base de datos
    if [ -f "./prisma/seed.ts" ]; then
        echo "🌱 Ejecutando seed de datos..."
        npx prisma db seed || echo "⚠️ Error en seed, continuando..."
    else
        echo "⚠️  No se encontró archivo de seed"
    fi
fi

# Verificar que la base de datos es accesible
echo "🔍 Verificando acceso a la base de datos..."
if [ -r "${DB_FILE}" ] && [ -w "${DB_FILE}" ]; then
    echo "✅ Base de datos accesible: ${DB_FILE}"
    ls -la "${DB_FILE}"
else
    echo "❌ Error: Base de datos no accesible: ${DB_FILE}"
    ls -la "${DB_DIR}"
    exit 1
fi

echo "✅ Base de datos configurada correctamente"
echo "🚀 Iniciando aplicación..."

# Iniciar la aplicación Next.js en modo producción
exec npm start
