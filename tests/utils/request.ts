import type { IncomingHttpHeaders } from 'node:http';

import type { ServerType } from '@hono/node-server';
import supertest, { type Response } from 'supertest';

import { APIVersion } from '@/constants/api-route';
import { server as s } from '@/server';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type ExtractDynamicPathParams<
  TRoute extends string,
  TVal = string | number,
> = TRoute extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: TVal } & ExtractDynamicPathParams<`/${Rest}`>
  : TRoute extends `${string}:${infer Param}`
    ? { [K in Param]: TVal }
    : Record<never, never>;

type RouteInterpolationOptions<
  TRoute extends string,
  TParam = ExtractDynamicPathParams<TRoute>,
> = {
  route: TRoute;
} & (keyof TParam extends never ? { params?: never } : { params: TParam });

type RequestOptions<TRoute extends string> = {
  method: HttpMethod;
  payload?: object;
  query?: object;
  headers?: IncomingHttpHeaders;
  redirect?: number;
  prefix?: string;
  server?: ServerType;
} & RouteInterpolationOptions<TRoute>;

const interpolate = <TPath extends string>({
  route,
  params,
}: {
  route: TPath;
  params?: ExtractDynamicPathParams<TPath>;
}) => {
  let result: string = route;

  for (const key in params) {
    if (Object.hasOwn(params, key)) {
      const toReplace = `:${key}`;
      const value = params[key as keyof typeof params];
      // oxlint-disable-next-line typescript/restrict-template-expressions
      result = result.replaceAll(toReplace, `${value}`);
    }
  }

  return result;
};

export const request = <TRoute extends string>({
  route,
  params,
  server = s,
  method,
  prefix = APIVersion.V1,
  headers = {},
  payload,
  query = {},
}: RequestOptions<TRoute>): Promise<Response> => {
  let path: string = route;

  if (params !== undefined) {
    path = interpolate<typeof route>({ route, params });
  }

  // prettier-ignore
  return supertest(server)[method](`${prefix}${path}`)
    .set(headers)
    .query(query)
    .send(payload);
};
