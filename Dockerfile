# Usar Node.js 24 Alpine - la versión más reciente
FROM node:24-alpine AS base

# Instalar dependencias del sistema necesarias para Tailwind CSS v4 y Prisma
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev

WORKDIR /app

# Instalar dependencias de producción
FROM base AS deps
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --omit=dev --ignore-scripts; \
  else \
    echo "Lockfile not found." && npm install --omit=dev --ignore-scripts; \
  fi

# Build de la aplicación
FROM base AS builder
WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json* ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY next.config.js ./
COPY tsconfig.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --ignore-scripts; \
  else \
    echo "Lockfile not found." && npm install --ignore-scripts; \
  fi

# Copiar código fuente
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construir la aplicación con Tailwind CSS v4
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app

# Instalar dependencias de runtime para Prisma
RUN apk add --no-cache \
    openssl \
    ca-certificates

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Configurar permisos para el directorio .next
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar archivos de build con permisos correctos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar esquema de Prisma y base de datos
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Crear directorio para la base de datos con permisos correctos
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
