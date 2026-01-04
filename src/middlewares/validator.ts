// oxlint-disable max-lines-per-function
import type { MiddlewareHandler } from 'hono';
import * as z from 'zod';

import { env } from '@/configs/environment';
import { ErrorMessage } from '@/constants/error-message';
import { HttpStatus } from '@/constants/http-status';
import type { InferZodOrNull } from '@/types/utils';
import { BadRequestError, CustomError } from '@/utils/error';
import logger from '@/utils/logger';
import { decode as decodeQs } from '@/utils/querystring';
import { BaseErrorResponseSchema } from '@/validators/common/schema';

export const validator = <
  TBodySchema extends z.ZodType | undefined = undefined,
  TParamSchema extends z.ZodType | undefined = undefined,
  TQuerySchema extends z.ZodType | undefined = undefined,
  TResponseSchema extends z.ZodType | undefined = undefined,
>({
  body: bs,
  params: ps,
  query: qs,
  response: rs,
}: {
  body?: TBodySchema;
  params?: TParamSchema;
  query?: TQuerySchema;
  response?: TResponseSchema;
} = {}): MiddlewareHandler<{
  Variables: {
    body: InferZodOrNull<TBodySchema>;
    params: InferZodOrNull<TParamSchema>;
    query: InferZodOrNull<TQuerySchema>;
  };
}> => {
  return async (c, next) => {
    if (bs) {
      const ct = c.req.header('Content-Type');

      if (ct === 'application/json') {
        try {
          // oxlint-disable-next-line no-unsafe-assignment
          const data = await c.req.json();
          const result = await bs.parseAsync(data);

          // oxlint-disable-next-line no-unsafe-type-assertion
          c.set('body', result as InferZodOrNull<TBodySchema>);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new BadRequestError(ErrorMessage.Generic.InvalidPayload, {
              inline: true,
              source: 'request_body',
              issues: error.issues,
            });
          }

          throw error;
        }
      } else {
        throw new BadRequestError(ErrorMessage.Generic.InvalidPayload);
      }
    }

    if (ps) {
      try {
        const data: Record<string, string> = c.req.param();
        const result = await ps.parseAsync(data);

        // oxlint-disable-next-line no-unsafe-type-assertion
        c.set('params', result as InferZodOrNull<TParamSchema>);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new BadRequestError(ErrorMessage.Generic.InvalidPayload, {
            inline: true,
            source: 'request_param',
            issues: error.issues,
          });
        }

        throw error;
      }
    }

    if (qs) {
      try {
        const url = new URL(c.req.url);
        const query = decodeQs(url.search.split('?').at(-1));
        const result = await qs.parseAsync(query);

        // oxlint-disable-next-line no-unsafe-type-assertion
        c.set('query', result as InferZodOrNull<TQuerySchema>);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new BadRequestError(ErrorMessage.Generic.InvalidPayload, {
            inline: true,
            source: 'request_query',
            issues: error.issues,
          });
        }

        throw error;
      }
    }

    await next();

    if (c.res.headers.get('Content-Type') === 'application/json') {
      let data = await c.res.json();

      if (rs) {
        try {
          data = await z.parseAsync(
            z.union([rs, BaseErrorResponseSchema]),
            data,
          );
        } catch (error) {
          logger.error('failed to validate the response data', { error });

          throw new CustomError(
            ErrorMessage.Generic.IncorrectResponse,
            HttpStatus.InternalServerError,
            // @ts-expect-error -- though error is type `unknown`, it is internally a `ZodError`
            env.SERVER_ERROR_DEBUG ? error : undefined,
          );
        }
      } else {
        throw new CustomError(
          ErrorMessage.Generic.IncorrectResponse,
          HttpStatus.InternalServerError,
        );
      }

      c.res = new Response(JSON.stringify(data), {
        status: c.res.status,
        headers: Object.fromEntries(c.res.headers),
      });
    }
  };
};
