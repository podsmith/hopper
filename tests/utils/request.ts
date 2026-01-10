import type { Hono } from 'hono';

import { app as httpApp } from '@/app';
import { APIVersion } from '@/constants/api-route';
import { encode } from '@/utils/querystring';

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
  app?: Hono;
} & {
  body?: object;
  query?: object;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
  prefix?: `/${string}`;
} & Omit<RequestInit, 'body' | 'method'> &
  RouteInterpolationOptions<TRoute>;

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

export const request = async <TRoute extends `/${string}`>({
  app = httpApp,
  params,
  route,
  body,
  query,
  method = 'GET',
  prefix = APIVersion.V1,
  ...opts
}: RequestOptions<TRoute>) => {
  let path: string = route;

  if (params !== undefined) {
    path = interpolate<typeof route>({ route, params });
  }

  path = `${prefix}${path}?${encode(query)}`;

  const response = await app.request(path, {
    ...opts,
    body: JSON.stringify(body),
    method,
  });

  return {
    status: response.status,
    json: await response.json(),
    success: response.ok,
  };
};
