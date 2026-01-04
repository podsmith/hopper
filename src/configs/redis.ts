import Redis from 'ioredis';

import { env } from '@/configs/environment';

export const redis = new Redis(env.REDIS_URL, {
  enableReadyCheck: true,
  commandTimeout: 2000,
});
