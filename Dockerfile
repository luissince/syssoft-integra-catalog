# 1 - Etapa de construcción
FROM node:18-alpine AS builder

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
FROM node:18-alpine AS runner

# Crear directorio para la aplicación
WORKDIR /app

# Pone la aplicación en modo producción
ENV NODE_ENV production

# Copiar solo los archivos necesarios
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose el puerto 3000
EXPOSE 3000

# Inicia en el puerto 3000
ENV PORT 3000

# Ejecuta la aplicación
CMD ["node", "server.js"]