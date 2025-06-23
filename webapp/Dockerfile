# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo lo necesario al inicio para mejorar el cache
COPY webapp/package.json webapp/package-lock.json* ./webapp/

WORKDIR /app/webapp

RUN npm install

# Copiamos el resto del proyecto
COPY webapp/. .

# Construimos la app Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiamos los archivos necesarios desde el builder
COPY --from=builder /app/webapp/.next .next
COPY --from=builder /app/webapp/public public
COPY --from=builder /app/webapp/package.json ./
COPY --from=builder /app/webapp/next.config.js ./

# Instalamos solo dependencias necesarias para producción
RUN npm install --omit=dev

EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
