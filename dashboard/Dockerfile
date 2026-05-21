# syntax=docker/dockerfile:1
# Multi-stage build for the self-hosted PromptGuard dashboard.
# Same image runs on Proxmox (now) and Hetzner (later).

FROM node:20-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
# openssl + ca-certificates are required by the Prisma query engine.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---- dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
# The prisma schema must exist before `npm ci`: the postinstall hook runs
# `prisma generate`, which exits 1 without prisma/schema.prisma present.
COPY prisma ./prisma
RUN npm ci

# ---- build ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* is inlined at build time. The deploy/settings pages use this to
# prefill the dashboard URL in IT-rollout templates, so it must be correct at
# build. Changing it later requires a rebuild.
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
# Flip the Prisma datasource from sqlite -> postgresql for self-host/prod.
RUN node scripts/use-postgres.mjs
# Dummy URL: no DB is reached during `next build` (all dashboard pages are
# dynamic via cookies()), but Prisma needs a syntactically valid value.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# ---- runtime ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

# Prisma CLI (same major as @prisma/client) for `migrate deploy` at startup.
# migrate deploy only applies committed SQL, so 6.x CLI/client skew is safe.
RUN npm install -g prisma@6

# Next.js standalone server + assets.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma schema (already postgresql) + committed migrations, and the generated
# client/engine (copied explicitly so it can't be missed by output tracing).
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
