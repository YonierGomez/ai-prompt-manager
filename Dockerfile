# Dockerfile universal - funciona en cualquier máquina
FROM node:22-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat openssl sqlite

WORKDIR /app

# Stage 1: Instalar dependencias
FROM base AS deps
COPY package*.json ./
RUN npm ci --no-audit --no-fund --silent 2>/dev/null && \
    npm cache clean --force

# Stage 2: Build de la aplicación
FROM base AS builder
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Generar Prisma client
RUN npx prisma generate

# Build de Next.js
RUN npm run build

# Stage 3: Imagen final de producción
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

# Copiar solo dependencias de producción
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copiar archivos de aplicación desde el builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts/init-db.sh ./scripts/init-db.sh
COPY --from=builder --chown=nextjs:nodejs /app/.env.docker ./.env

# Configurar permisos y crear directorios para datos persistentes
RUN chmod +x ./scripts/init-db.sh && \
    mkdir -p ./data ./uploads

USER nextjs

EXPOSE 3000

CMD ["./scripts/init-db.sh"]
