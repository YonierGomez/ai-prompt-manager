# Dockerfile simplificado para evitar problemas de memoria
FROM node:24-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache sqlite

WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install --silent --no-warnings

# Generar Prisma client
RUN npx prisma generate

# Crear directorio de datos
RUN mkdir -p data uploads

EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar y dar permisos al script de inicio
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

CMD ["./start.sh"]
