import { BaseService } from '@/services/base';

export class HealthService extends BaseService {
  check() {
    return Promise.all([
      this.db.sql`select now() as timestamp;`,
      this.cache.ping(),
    ]);
  }
}
