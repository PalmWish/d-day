FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/ 

RUN npm install
RUN npx prisma generate

FROM base AS runner
ENV NODE_ENV=prod

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY prisma ./prisma


EXPOSE 3000
CMD ["node", "src/server.js"]