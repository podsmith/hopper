import { randomUUIDv7 } from 'bun';
import { describe, expect, it } from 'vitest';

import { redis } from '@/configs/redis';
import { APIRoute } from '@/constants/api-route';
import { HttpStatus } from '@/constants/http-status';
import { request } from '~/utils/request';

describe('health check route', () => {
  it('should return with success status if integration works as expected', async () => {
    const { success, status } = await request({
      route: APIRoute.Health,
    });

    expect(success).toBeTruthy();
    expect(status).toBe(HttpStatus.Ok);
  });

  it('should return with not found error status if integration path is wrong', async () => {
    const { success, status } = await request({
      route: `${APIRoute.Health}/${randomUUIDv7()}`,
    });

    expect(success).toBeFalsy();
    expect(status).toBe(HttpStatus.NotFound);
  });

  it('should return with internal server error status if integration dependency not working', async () => {
    redis.disconnect();

    const { success, status } = await request({
      route: APIRoute.Health,
    });

    expect(success).toBeFalsy();
    expect(status).toBe(HttpStatus.InternalServerError);
  });
});
