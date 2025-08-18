# Dockerfile optimizado para memoria limitada
FROM node:22-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat openssl sqlite

WORKDIR /app

# Stage 1: Instalar solo dependencias de producción
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund --silent 2>/dev/null && \
    npm cache clean --force

# Stage 2: Instalar dependencias de desarrollo para el build
FROM base AS build-deps
COPY package*.json ./
RUN npm ci --no-audit --no-fund --silent 2>/dev/null && \
    npm cache clean --force

# Stage 3: Build de la aplicación (simplificado)
FROM base AS builder
COPY package*.json ./
COPY --from=build-deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar Prisma client
RUN npx prisma generate

# Build de Next.js sin restricciones de memoria
RUN npm run build

# Stage 4: Imagen final de producción
FROM base AS runner

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Variables de entorno
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="file:./data/dev.db" \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copiar dependencias de producción y archivos necesarios
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/scripts/init-db.sh ./scripts/init-db.sh
COPY --from=builder --chown=nextjs:nodejs /app/.env.docker ./.env

# Configurar permisos y crear directorios para datos persistentes
RUN chmod +x ./scripts/init-db.sh && \
    mkdir -p ./data ./uploads && \
    chown -R nextjs:nodejs ./data ./uploads

USER nextjs

EXPOSE 3000

CMD ["./scripts/init-db.sh"]
