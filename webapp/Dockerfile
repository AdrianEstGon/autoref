# Dockerfile ubicado dentro de /webapp
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

RUN addgroup -g 10014 nextjs && adduser -u 10014 -G nextjs -s /bin/sh -D nextjs

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json ./

RUN npm install --omit=dev

USER 10014

EXPOSE 3000

CMD ["npm", "start"]
