# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar los archivos necesarios primero (mejora caché)
COPY webapp/package.json webapp/package-lock.json* ./webapp/

WORKDIR /app/webapp

RUN npm install

# Copiar el resto del código
COPY webapp/. .

# Build de Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS runner

# Crear un usuario no root (UID recomendada entre 10000-20000 para Choreo)
RUN addgroup -g 10014 nextjs && adduser -u 10014 -G nextjs -s /bin/sh -D nextjs

WORKDIR /app

ENV NODE_ENV=production

# Copiar artefactos necesarios del build
COPY --from=builder /app/webapp/.next .next
COPY --from=builder /app/webapp/public public
COPY --from=builder /app/webapp/package.json ./
COPY --from=builder /app/webapp/next.config.js ./

# Instalar solo dependencias necesarias para producción
RUN npm install --omit=dev

# Usar el usuario no root creado
USER 10014

EXPOSE 3000

CMD ["npm", "start"]

