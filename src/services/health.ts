import { sql } from 'kysely';

import { BaseService } from '@/services/base';

export class HealthService extends BaseService {
  check() {
    return Promise.all([
      sql`SELECT now(), ${Date.now()} as dt;`.execute(this.db),
      this.cache.ping(),
    ]);
  }
}
