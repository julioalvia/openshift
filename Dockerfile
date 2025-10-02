# Multi-stage build: build con pnpm y servir con Nginx

ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

# Instalar pnpm sin corepack (evita errores de firma en contenedores)
RUN npm i -g pnpm@10.12.4

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY . .

# Build arg para inyectar URL del webhook
ARG VITE_N8N_WEBHOOK_URL
ENV VITE_N8N_WEBHOOK_URL=${VITE_N8N_WEBHOOK_URL}

RUN pnpm build

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


