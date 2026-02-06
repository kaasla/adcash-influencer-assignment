FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend/package.json ./packages/backend/
RUN pnpm install --frozen-lockfile --filter @adcash/backend...

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules
COPY packages/backend ./packages/backend
COPY tsconfig.base.json ./
WORKDIR /app/packages/backend
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/packages/backend
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json ./
COPY --from=builder /app/packages/backend/src/db/schema.ts ./src/db/schema.ts
COPY --from=builder /app/packages/backend/drizzle.config.ts ./
COPY --from=deps /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ../
COPY --from=builder /app/tsconfig.base.json ../
RUN pnpm install --frozen-lockfile --prod --filter @adcash/backend...

EXPOSE 3000
CMD ["sh", "-c", "pnpm exec drizzle-kit push && node dist/server.js"]
