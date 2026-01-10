import { describe, expect, it } from 'vitest';

import { redis } from '@/configs/redis';
import { APIRoute } from '@/constants/api-route';
import { request } from '~/utils/request';

describe('health check route', () => {
  it('should return with success status if integration works as expected', async () => {
    const { success } = await request({
      route: APIRoute.Health,
    });

    expect(success).toBeTruthy();
  });

  it('should not return with success status if integration fails', async () => {
    redis.disconnect();

    const { success } = await request({
      route: APIRoute.Health,
    });

    expect(success).toBeFalsy();
  });
});
