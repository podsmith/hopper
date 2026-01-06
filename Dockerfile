FROM oven/bun:alpine AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install --frozen-lockfile

COPY . .

RUN bun build \
  --production \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --minify-identifiers \
  --target bun \
  --outfile server \
  --no-compile-autoload-dotenv \
  --compile-autoload-package-json \
  --sourcemap=inline \
  src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

ARG SERVER_PORT=8080
ARG REVISION="unspecified"

ENV SERVER_PORT=$SERVER_PORT \
  REVISION=$REVISION \
  NODE_ENV=production \
  TZ=UTC

COPY --from=build /app/server server

EXPOSE ${SERVER_PORT}

CMD ["./server"]