import { randomUUIDv7 } from 'bun';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { HTTPException } from 'hono/http-exception';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { timeout } from 'hono/timeout';
import { timing } from 'hono/timing';
import { trimTrailingSlash } from 'hono/trailing-slash';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { env } from '@/configs/environment';
import { APIVersion } from '@/constants/api-route';
import { ErrorMessage } from '@/constants/error-message';
import { HttpStatus } from '@/constants/http-status';
import { healthRoutes } from '@/routers/health';
import { CustomError, formatErrorResponse, NotFoundError } from '@/utils/error';
import logger from '@/utils/logger';

// ============================== all the routers are to be mentioned here
const router = new Hono().route('', healthRoutes);

export const app = new Hono()
  // ============================== the following middlewares are common for all routes
  .use(cors({ origin: env.SERVER_CORS_ORIGIN, credentials: true }))
  .use(etag())
  .use(secureHeaders())
  .use(trimTrailingSlash())
  .use(requestId({ generator: () => randomUUIDv7() }))
  .use(timing({ enabled: env.SERVER_TIMING_DEBUG }))
  .use(
    timeout(
      env.SERVER_TIMEOUT_MS,
      new HTTPException(HttpStatus.RequestTimeout, {
        message: ErrorMessage.Generic.RequestTimeout(env.SERVER_TIMEOUT_MS),
      }),
    ),
  )
  .use(
    bodyLimit({
      maxSize: env.SERVER_MAX_BODY_SIZE_KB,
      onError: () => {
        throw new CustomError(
          ErrorMessage.Generic.PayloadSizeExceeds,
          HttpStatus.RequestEntityTooLarge,
        );
      },
    }),
  )
  // ============================== the following are the error handlers
  .notFound((c) => {
    const { path, method } = c.req;

    throw new NotFoundError(
      ErrorMessage.Fields.KeyNotFound('requested resource'),
      {
        path,
        method,
      },
    );
  })
  .onError((error, c) => {
    const { status, details, stack, message } = formatErrorResponse(error);

    if (status >= HttpStatus.InternalServerError) {
      logger.error(message, { error, status, stack });
    } else {
      logger.debug(message, { error, status, stack });
    }

    return c.json(
      {
        message,
        details,
        stack: env.SERVER_ERROR_DEBUG
          ? stack
          : /* istanbul ignore next -- @preserve */ undefined,
      },
      // oxlint-disable-next-line no-unsafe-type-assertion
      status as ContentfulStatusCode,
    );
  })
  .route(APIVersion.V1, router);
