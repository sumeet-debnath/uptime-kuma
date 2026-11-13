# Build setup for the Agent-Ready Web Benchmark, not part of the app: Uptime
# Kuma's production image built from this checkout alone (the official
# docker/dockerfile expects the frontend built on the host first).
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
COPY .npmrc package.json package-lock.json ./
# the Agent Object Model's core, packed (package.json installs it from here)
COPY vendor vendor
RUN npm ci
COPY . .
# AGENT_OM=off: the guideline changes without the Agent Object Model's projector or its sitemap
ARG AGENT_OM=on
ENV VITE_AGENT_OM=$AGENT_OM
RUN if [ "$AGENT_OM" = off ]; then \
        sed -i '/rel="semantic-sitemap"/d' index.html && rm public/semantic-sitemap.json && \
        npx vite build --config ./config/vite.config.js; \
    else npm run build; fi && \
    npm prune --omit=dev

FROM louislam/uptime-kuma:base2-slim
WORKDIR /app
ENV UPTIME_KUMA_IS_CONTAINER=1
COPY --from=build /app /app
RUN mkdir -p /app/data
EXPOSE 3001
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server/server.js"]
