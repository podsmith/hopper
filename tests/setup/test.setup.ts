import path from 'node:path';

import Redis from 'ioredis';

import { env } from '@/configs/environment';
import { redis } from '@/configs/redis';
import dataSource from '@/database/source';
import logger from '@/utils/logger';

beforeAll(async () => {
  await dataSource.initialize();

  const tp = path.parse(`${expect.getState().testPath}`);
  const fn = tp.base.replaceAll(/\.(test|spec)\./g, '.data.');
  const p = path.join(tp.dir, fn);

  try {
    const mod: unknown = await import(p);

    if (
      typeof mod === 'object' &&
      mod !== null &&
      'setup' in mod &&
      typeof mod.setup === 'function'
    ) {
      // oxlint-disable-next-line no-unsafe-call - effective verifications are already performed with proper checks
      await mod.setup();
    }
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'MODULE_NOT_FOUND'
    ) {
      logger.error(`Failed to import and/or load '${p}'`, error);
    } else {
      throw error;
    }
  }

  const redis = new Redis(env.REDIS_URL);
  await redis.flushdb();
  redis.disconnect();
});

afterAll(async () => {
  await dataSource.destroy();
  redis.disconnect();
});
