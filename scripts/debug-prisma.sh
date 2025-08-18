#!/bin/sh

echo "🔍 Diagnóstico completo de Prisma y Base de Datos"
echo "================================================"

# Información del entorno
echo "📋 Información del entorno:"
echo "NODE_ENV: ${NODE_ENV}"
echo "DATABASE_URL: ${DATABASE_URL}"
echo "PWD: $(pwd)"
echo "USER: $(whoami)"
echo "UID: $(id -u)"
echo "GID: $(id -g)"
echo ""

# Verificar estructura de directorios
echo "📁 Estructura de directorios:"
ls -la /app/ | head -20
echo ""

# Verificar directorio prisma
echo "📁 Contenido del directorio prisma:"
if [ -d "./prisma" ]; then
    ls -la ./prisma/
else
    echo "❌ Directorio ./prisma no existe"
fi
echo ""

# Verificar directorio data
echo "📁 Contenido del directorio data:"
if [ -d "./data" ]; then
    ls -la ./data/
else
    echo "❌ Directorio ./data no existe"
fi
echo ""

# Verificar archivos de configuración
echo "📄 Archivos de configuración:"
echo "Verificando .env:"
if [ -f "./.env" ]; then
    echo "✅ .env existe"
    cat ./.env
else
    echo "❌ .env no existe"
fi
echo ""

echo "Verificando .env.production:"
if [ -f "./.env.production" ]; then
    echo "✅ .env.production existe"
    cat ./.env.production
else
    echo "❌ .env.production no existe"
fi
echo ""

# Verificar schema de Prisma
echo "📄 Schema de Prisma:"
if [ -f "./prisma/schema.prisma" ]; then
    echo "✅ schema.prisma existe"
    head -20 ./prisma/schema.prisma
else
    echo "❌ schema.prisma no existe"
fi
echo ""

# Verificar cliente generado de Prisma
echo "📦 Cliente de Prisma:"
if [ -d "./node_modules/@prisma/client" ]; then
    echo "✅ Cliente de Prisma generado"
    ls -la ./node_modules/@prisma/client/ | head -10
else
    echo "❌ Cliente de Prisma no encontrado"
fi
echo ""

# Intentar generar cliente de Prisma
echo "🔄 Intentando generar cliente de Prisma..."
npx prisma generate || echo "❌ Error generando cliente"
echo ""

# Verificar conexión a base de datos
echo "🔗 Verificando conexión a base de datos..."
npx prisma db push --accept-data-loss || echo "❌ Error conectando a base de datos"
echo ""

# Información final
echo "📊 Resumen final:"
echo "Directorio actual: $(pwd)"
echo "Archivos en directorio actual:"
ls -la . | grep -E "\.(db|sqlite|env)" || echo "No se encontraron archivos de DB o ENV"
echo ""

echo "🏁 Diagnóstico completado"
