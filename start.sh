#!/bin/sh
echo "🚀 Inicializando base de datos para producción si es necesario..."
if [ ! -f "data/prod.db" ]; then
  echo "📦 Creando base de datos..."
  npx prisma db push --force-reset
  echo "🌱 Ejecutando seed..."
  npx tsx prisma/seed.ts || echo "⚠️ Seed opcional falló, continuando..."
fi

echo "🚀 Iniciando Next.js en modo desarrollo (para evitar problemas de memoria)..."
exec npm run dev -- --hostname 0.0.0.0
