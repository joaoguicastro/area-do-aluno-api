# -------- Base para dependências + generate --------
FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma client precisa do schema na hora do generate
COPY prisma ./prisma
RUN npx prisma generate

# -------- Build TypeScript --------
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# -------- Runtime enxuto --------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Instalar só prod deps (roda postinstall do @prisma/client)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npm cache clean --force

# Copiar build
COPY --from=build /app/dist ./dist

# Diretório de uploads
RUN mkdir -p /app/uploads

EXPOSE 3333
CMD ["node", "dist/server.js"]
