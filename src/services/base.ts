import type { Redis } from 'ioredis';
import type { EntityManager } from 'typeorm';

import { redis } from '@/configs/redis';
import dataSource from '@/database/source';

export abstract class BaseService {
  db: EntityManager;
  cache: Redis;

  constructor(db: EntityManager = dataSource.manager, cache: Redis = redis) {
    this.db = db;
    this.cache = cache;
  }
}
