#!/bin/bash

echo "🔍 Verificando estado de la aplicación..."

# Verificar si el contenedor está corriendo
echo "📦 Estado del contenedor:"
docker-compose ps

echo ""
echo "🩺 Verificando salud de la aplicación:"
curl -s http://localhost:3000/api/health | jq .

echo ""
echo "📋 Últimos logs del contenedor:"
docker-compose logs --tail=20

echo ""
echo "💽 Verificando volúmenes:"
docker volume ls | grep ai_prompt

echo ""
echo "📁 Contenido del volumen de datos:"
docker run --rm -v ai_prompt_data:/data alpine ls -la /data
