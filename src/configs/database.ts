import { SQL } from 'bun';
import dotenv from 'dotenv-flow';
import {
  CamelCasePlugin,
  DeduplicateJoinsPlugin,
  HandleEmptyInListsPlugin,
  replaceWithNoncontingentExpression,
  type KyselyConfig,
} from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { v7 as uuidv7 } from 'uuid';

import logger from '@/utils/logger';
import { DatabaseEnvironmentSchema } from '@/validators/schemas/environment';

dotenv.config({ purge_dotenv: true, silent: true });

const result = DatabaseEnvironmentSchema.safeParse(process.env);

/* c8 ignore start */
if (result.error) {
  logger.error(
    'could not validate the environment variables for database connection',
    result.error,
  );
  // oxlint-disable-next-line no-process-exit - In case environment variables are not correct
  process.exit(1);
}
/* c8 ignore end */

export const env = result.data;

const pool = new SQL({
  adapter: 'postgres',
  url: env.DB_URL,
  max: env.DB_POOL_SIZE,
  connectionTimeout: env.DB_CONN_TIMEOUT_MS,
  bigint: true,
  tls: env.DB_SSL_CERTIFICATE
    ? {
        rejectUnauthorized: true,
        ca: env.DB_SSL_CERTIFICATE,
      }
    : false,
});

export const kyselyConfig: KyselyConfig = {
  dialect: new PostgresJSDialect({
    postgres: pool,
  }),
  plugins: [
    new HandleEmptyInListsPlugin({
      strategy: replaceWithNoncontingentExpression,
    }),
    new CamelCasePlugin(),
    new DeduplicateJoinsPlugin(),
  ],
  log: env.DB_LOGS_ENABLED
    ? (e) => {
        const queryId = uuidv7();
        const {
          query: { sql, parameters },
          queryDurationMillis,
          level,
        } = e;

        if (level === 'error') {
          logger.error('query failed to execute', {
            sql,
            parameters: env.DB_LOGS_PARAMETER_ENABLED ? parameters : undefined,
            duration: queryDurationMillis,
            key: 'db_query_failed',
            queryId,
          });
          return;
        }

        logger.debug('query executed', {
          sql,
          parameters: env.DB_LOGS_PARAMETER_ENABLED ? parameters : undefined,
          duration: queryDurationMillis,
          key: 'db_query_executed',
          queryId,
        });
      }
    : undefined,
};
