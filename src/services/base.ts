import type { Redis } from 'ioredis';

import { redis } from '@/configs/redis';
import { dbConn } from '@/database/connection';
import type { DatabaseConnection } from '@/types/utils';

export abstract class BaseService {
  db: DatabaseConnection;
  cache: Redis;

  constructor(db: DatabaseConnection = dbConn, cache: Redis = redis) {
    this.db = db;
    this.cache = cache;
  }
}
