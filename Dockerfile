# Multi-architecture build support
# Soporta tanto x86_64 como ARM (arm64, armv7)
FROM --platform=$BUILDPLATFORM node:24-alpine AS base

# Declarar argumentos de build para multi-arquitectura
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETOS
ARG TARGETARCH

# Mostrar información de la plataforma en build logs
RUN echo "Building for $TARGETPLATFORM on $BUILDPLATFORM"

# Instalar dependencias del sistema necesarias para Tailwind CSS v4 y Prisma
# Compatibles con múltiples arquitecturas
RUN apk add --no-cache \
    libc6-compat \
    ca-certificates \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    sqlite

WORKDIR /app

# Instalar dependencias de producción
FROM base AS deps
COPY package.json package-lock.json* ./

# Instalar dependencias optimizadas para la arquitectura de destino
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --omit=dev --ignore-scripts --platform=$TARGETPLATFORM; \
  else \
    echo "Lockfile not found." && npm install --omit=dev --ignore-scripts --platform=$TARGETPLATFORM; \
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
# Optimizado para la arquitectura de destino
RUN \
  if [ -f package-lock.json ]; then \
    npm ci --ignore-scripts --platform=$TARGETPLATFORM; \
  else \
    echo "Lockfile not found." && npm install --ignore-scripts --platform=$TARGETPLATFORM; \
  fi

# Copiar código fuente
COPY . .

# Generar el cliente de Prisma para la arquitectura específica
RUN npx prisma generate

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Construir la aplicación con Tailwind CSS v4
# El build se optimiza automáticamente para la arquitectura de destino
RUN npm run build

# Imagen de producción - optimizada para múltiples arquitecturas
FROM base AS runner
WORKDIR /app

# Instalar dependencias de runtime para Prisma
# SQLite funciona nativamente en todas las arquitecturas
RUN apk add --no-cache \
    openssl \
    ca-certificates \
    sqlite

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
