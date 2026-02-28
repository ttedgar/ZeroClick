FROM node:20-alpine AS base
RUN npm install -g pnpm

# ── deps ─────────────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/client/package.json ./apps/client/package.json
RUN pnpm install --frozen-lockfile

# ── build shared ─────────────────────────────────────────────────────────────
FROM deps AS build-shared
WORKDIR /app
COPY packages/shared ./packages/shared
RUN pnpm --filter shared build

# ── build client ─────────────────────────────────────────────────────────────
FROM build-shared AS build-client
COPY apps/client ./apps/client
COPY tsconfig.base.json ./
RUN pnpm --filter client build

# ── build server ─────────────────────────────────────────────────────────────
FROM build-client AS build-server
COPY apps/server ./apps/server
RUN pnpm --filter server db:generate && pnpm --filter server build

# ── production image ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app

COPY --from=build-server /app/package.json ./
COPY --from=build-server /app/pnpm-workspace.yaml ./
COPY --from=build-server /app/node_modules ./node_modules
COPY --from=build-server /app/packages/shared/dist ./packages/shared/dist
COPY --from=build-server /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build-server /app/apps/server/dist ./apps/server/dist
COPY --from=build-server /app/apps/server/package.json ./apps/server/package.json
COPY --from=build-server /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=build-server /app/apps/server/prisma ./apps/server/prisma
COPY --from=build-client /app/apps/client/dist ./apps/client/dist

EXPOSE 8080
CMD ["node", "apps/server/dist/index.js"]
