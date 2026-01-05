export const APIRoute = {
  // common routes for health and monitoring
  Health: '/health',
} as const satisfies Record<string, `/${string}`>;

export const APIVersion = { V1: '/api/v1' } as const satisfies Record<
  string,
  `/${string}`
>;
