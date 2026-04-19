FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS runner
ENV NODE_ENV=prod
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY .env.prod ./.env.prod
EXPOSE 3000
CMD ["node", "src/server.js"]
