import Redis from 'ioredis';
import { afterAll, beforeAll } from 'vitest';

import { env } from '@/configs/environment';
import { dbConn } from '@/database/connection';

beforeAll(async () => {
  const redis = new Redis(env.REDIS_URL);
  await redis.flushdb();
  redis.disconnect();
});

afterAll(async () => {
  await dbConn.destroy();
});
