import { Hono } from 'hono';

import { APIRoute } from '@/constants/api-route';
import dataSource from '@/database/source';
import { validator } from '@/middlewares/validator';
import { HealthService } from '@/services/health';
import { GetHealthStatusResponseSchema } from '@/validators/schemas/health';

export const healthRoutes = new Hono().get(
  APIRoute.Health,
  validator({ response: GetHealthStatusResponseSchema }),
  async (c) => {
    const service = new HealthService(dataSource.manager);

    await service.check();

    return c.json({ isHealthy: true, timestamp: new Date() });
  },
);
