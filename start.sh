#!/bin/sh
echo "🚀 Inicializando base de datos si es necesario..."
if [ ! -f "data/dev.db" ]; then
  npx prisma db push --force-reset
  npx tsx prisma/seed.ts || echo "Seed opcional falló, continuando..."
fi
echo "🚀 Iniciando en modo producción..."
echo "🚀 Inicializando base de datos para producción si es necesario..."
if [ ! -f "data/prod.db" ]; then
  npx prisma db push --force-reset
  npx tsx prisma/seed.ts || echo "Seed opcional falló, continuando..."
fi

echo "🚀 Iniciando Next.js en modo standalone..."
exec node .next/standalone/server.js
