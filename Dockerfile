# Dockerfile optimizado para tamaño mínimo
FROM node:22-alpine AS base

# Instalar solo dependencias esenciales
RUN apk add --no-cache libc6-compat openssl sqlite

WORKDIR /app

# Stage 1: Dependencias de producción
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline && \
    npm cache clean --force && \
    rm -rf ~/.npm

# Stage 2: Imagen final
FROM base AS runner

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Variables de entorno
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="file:./prisma/dev.db" \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copiar solo las dependencias de producción necesarias
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copiar archivos de aplicación
COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs public ./public
COPY --chown=nextjs:nodejs prisma ./prisma
COPY --chown=nextjs:nodejs scripts/init-db.sh ./scripts/init-db.sh

# Generar Prisma client y limpiar
RUN npx prisma generate && \
    rm -rf /tmp/* /root/.cache /root/.npm && \
    chmod +x ./scripts/init-db.sh && \
    mkdir -p ./prisma

USER nextjs

EXPOSE 3000

CMD ["./scripts/init-db.sh"]
