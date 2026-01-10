import 'reflect-metadata';

import path from 'node:path';

import {
  DefaultNamingStrategy,
  type DataSourceOptions,
  type NamingStrategyInterface,
} from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils.js';

import logger from '@/utils/logger';
import { DatabaseEnvironmentSchema } from '@/validators/schemas/environment';

const result = DatabaseEnvironmentSchema.safeParse(process.env);

/* istanbul ignore next */
if (result.error) {
  logger.error(
    'could not validate the environment variables for database connection',
    result.error,
  );
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

const env = result.data;

class SnakeCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(targetName: string, userSpecifiedName: string | undefined) {
    if (userSpecifiedName) {
      return userSpecifiedName;
    }

    return snakeCase(targetName);
  }

  columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[],
  ) {
    return (
      snakeCase([...embeddedPrefixes, ''].join('_')) +
      (customName ?? snakeCase(propertyName))
    );
  }

  relationName(propertyName: string) {
    return snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string) {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  joinTableName(
    firstTableName: string,
    secondTableName: string,
    firstPropertyName: string,
  ) {
    return snakeCase(
      `${firstTableName}_${firstPropertyName.replaceAll('.', '_')}_${secondTableName}`,
    );
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ) {
    return snakeCase(`${tableName}_${columnName ?? propertyName}`);
  }

  classTableInheritanceParentColumnName(
    parentTableName: string,
    parentTableIdPropertyName: string,
  ) {
    return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
  }

  eagerJoinRelationAlias(alias: string, propertyPath: string) {
    return `${alias}_${propertyPath.replace('.', '_')}`;
  }
}

const typeOrmDefaultOptions: DataSourceOptions = {
  type: 'postgres',
  schema: 'public',
  useUTC: true,
  uuidExtension: 'pgcrypto',
  installExtensions: true,
  url: env.DB_URL,
  connectTimeoutMS: env.DB_CONN_TIMEOUT_MS,
  poolSize: env.DB_POOL_SIZE,
  namingStrategy: new SnakeCaseNamingStrategy(),
  logger: 'simple-console',
  logging: env.DB_LOGS_ENABLED,
  entities: [
    path.join(import.meta.dirname, '../database/_entities/*.{js,ts}'),
    path.join(import.meta.dirname, '../database/_views/*.{js,ts}'),
  ],
  ssl: env.DB_SSL_CERTIFICATE
    ? {
        rejectUnauthorized: true,
        ca: env.DB_SSL_CERTIFICATE,
      }
    : false,
};

export const typeOrmMigrationOptions: DataSourceOptions = {
  ...typeOrmDefaultOptions,
  migrations: [
    path.join(import.meta.dirname, '../database/_migrations/*.{js,ts}'),
  ],
  migrationsTableName: 'typeorm_migration_references',
  metadataTableName: 'typeorm_migration_meta',
};

export const typeOrmSeederOptions: DataSourceOptions = {
  ...typeOrmDefaultOptions,
  migrations: [
    path.join(import.meta.dirname, '../database/_seeders/*.{js,ts}'),
  ],
  migrationsTableName: 'typeorm_seeder_references',
  metadataTableName: 'typeorm_seeder_meta',
  migrationsTransactionMode: 'each',
};
