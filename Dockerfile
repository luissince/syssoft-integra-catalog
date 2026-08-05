# 1 - Etapa de construcción
FROM node:20-alpine AS builder

# Crear directorio para la aplicación
WORKDIR /app

# Copiar el archivo package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar archivos
COPY . .

# Compilar
RUN npm run build

# 2 - Etapa de producción
FROM node:20-alpine AS runner

# Crear directorio para la aplicación
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiar solo los archivos necesarios
COPY --from=builder --chown=node:node /app/next.config.mjs ./
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Ejecutar como usuario sin privilegios
USER node

# Expose el puerto 3000
EXPOSE 3000

# Ejecuta la aplicación
CMD ["node", "server.js"]