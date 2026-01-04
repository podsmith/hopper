import { randomUUID } from 'node:crypto';

import { redis } from '@/configs/redis';
import { APIRoute } from '@/constants/api-route';
import { ErrorMessage } from '@/constants/error-message';
import dataSource from '@/database/source';
import { request } from '~/utils/request';

describe('checking health status of the server through configured endpoint', () => {
  describe('should return health status and timestamp', () => {
    it('if database and redis connected properly', async () => {
      const { body } = await request({ method: 'get', route: APIRoute.Health });

      expect(body.isHealthy).toBe(true);
      expect(
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{2,3}Z/.test(body.timestamp),
      ).toBe(true);
    });
  });

  describe('should receive error response', () => {
    it('if database connection failed', async () => {
      await dataSource.destroy();

      const { body } = await request({ method: 'get', route: APIRoute.Health });

      expect(body.message).toBe(ErrorMessage.Generic.SomethingWentWrong);

      await dataSource.initialize();
    });

    it('if redis connection failed', async () => {
      redis.disconnect();

      const { body } = await request({ method: 'get', route: APIRoute.Health });

      expect(body.message).toBe(ErrorMessage.Generic.SomethingWentWrong);

      await redis.connect();
    });

    it('if request method is used', async () => {
      const { body } = await request({
        method: 'post',
        route: APIRoute.Health,
      });

      expect(body.message).toBe(
        ErrorMessage.Fields.KeyNotFound('requested resource'),
      );
    });

    it('if incorrect endpoint is called', async () => {
      const { body } = await request({
        method: 'get',
        route: `/${randomUUID()}`,
      });

      expect(body.message).toBe(
        ErrorMessage.Fields.KeyNotFound('requested resource'),
      );
    });

    it('if request payload is larger than expected/allowed', async () => {
      const { body } = await request({
        method: 'post',
        route: APIRoute.Health,
        payload: {
          data: '+'.repeat(1024 * 128), // 128KB
        },
      });

      expect(body.message).toBe(ErrorMessage.Generic.PayloadSizeExceeds);
    });
  });
});
