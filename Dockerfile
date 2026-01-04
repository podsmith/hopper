### Common setup
ARG BASE_TAG=node:24.12.0-alpine3.22

### Stage 1: Build
FROM ${BASE_TAG} AS builder

WORKDIR /app

COPY package*.json .npmrc /app
RUN npm ci

COPY . .

RUN npm run build \
  && npm ci --omit=dev --prefer-offline \
  && rm -rf src/ \
  && rm package-lock.json tsconfig* .npmrc \
  && find . -type f \
    \( -iname "*.d.ts" \
    -o -iname "*.ts" \
    -o -iname "*.d.cts" \
    -o -iname "*.d.mts" \
    -o -iname "license*" \
    -o -iname "security*" \
    -o -iname "contributing*" \
    -o -iname "history*" \
    -o -iname "changelog*" \
    -o -iname "readme*" \) -delete \
  && find . -type d -empty -print -delete \
  && rm -rf node_modules/zod/mini node_modules/zod/v4-mini node_modules/zod/v3

### Stage 2: Run
FROM ${BASE_TAG} AS runner

# Environment metadata
ARG SERVER_PORT=8080
ARG REVISION="unspecified"
ENV SERVER_PORT=$SERVER_PORT \
  REVISION=$REVISION \
  LOG_ENABLE_CONTAINER_ONLY=true \
  NODE_ENV=production \
  TZ=UTC

WORKDIR /app

COPY --chown=node:node --from=builder /app .

HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=5 \
  CMD wget --quiet --tries=5 --timeout=5 --spider \
  "http://localhost:${SERVER_PORT}/api/v1/health" || exit 1

EXPOSE ${SERVER_PORT}
USER node

CMD ["node", "--enable-source-maps", "build/index.js"]
