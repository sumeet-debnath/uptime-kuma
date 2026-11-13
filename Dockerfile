# Build setup for the Agent-Ready Web Benchmark, not part of the app: Uptime
# Kuma's production image built from this checkout alone (the official
# docker/dockerfile expects the frontend built on the host first).
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
COPY .npmrc package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM louislam/uptime-kuma:base2-slim
WORKDIR /app
ENV UPTIME_KUMA_IS_CONTAINER=1
COPY --from=build /app /app
RUN mkdir -p /app/data
EXPOSE 3001
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server/server.js"]
