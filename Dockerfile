# Dockerfile ultra-optimizado y funcional
FROM node:18-alpine

RUN apk add --no-cache sqlite

WORKDIR /app

# Copiar archivos esenciales
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install --silent --no-warnings

# Generar Prisma client
RUN npx prisma generate

# Build de Next.js para producción
RUN NODE_OPTIONS=--max-old-space-size=2048 npm run build

# Crear directorio de datos
RUN mkdir -p data

EXPOSE 3000

# Copiar y dar permisos al script de inicio
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
