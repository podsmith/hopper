import { SQL } from 'bun';
import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';

import type { DB } from '@/database/schema';

export const dbConn = new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: new SQL({
      database: 'test',
      host: 'localhost',
      max: 10,
      port: 5434,
      user: 'admin',
    }),
  }),
});
