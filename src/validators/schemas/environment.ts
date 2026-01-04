import dotenv from 'dotenv-flow';
import * as z from 'zod';

import {
  EmailFieldSchema,
  StringBooleanFieldSchema,
} from '@/validators/common/field';

dotenv.config({ purge_dotenv: true, silent: true });

export const DatabaseEnvironmentSchema = z.object({
  DB_URL: z
    .url({ error: 'PostgreSQL connection string is invalid' })
    .trim()
    .nonempty(),
  DB_POOL_SIZE: z.coerce.number().int().min(1).default(20),
  DB_APP_NAME: z.coerce.string().min(4).default('application'),
  DB_QUERY_TIMEOUT_MS: z.coerce.number().int().min(1).default(5000),
  DB_CONN_TIMEOUT_MS: z.coerce.number().int().min(1).default(10_000),
  DB_SSL_CERTIFICATE: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.split(String.raw`\n`).join('\n')),
  DB_LOGS_ENABLED: StringBooleanFieldSchema('Database log flag').default(false),
});

export const LoggingEnvironmentSchema = z.object({
  LOG_RETENTION_DAYS: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .transform((v) => `${v}d`),
  LOG_SILENCE: StringBooleanFieldSchema('Log flag').default(false),
});

export const ServerEnvironmentSchema = z.object({
  SERVER_PORT: z.coerce.number().int().min(8000).max(8999).default(8000),
  SERVER_TIMING_DEBUG:
    StringBooleanFieldSchema('Server timing flag').default(false),
  SERVER_TIMEOUT_MS: z.coerce.number().int().default(5000),
  SERVER_MAX_BODY_SIZE_KB: z.coerce
    .number()
    .positive()
    .default(100)
    .transform((v) => v * 1024),
  SERVER_CORS_ORIGIN: z
    .string()
    .trim()
    .optional()
    .default('*.example.com')
    .transform((v) => v.split(';').map((r) => r.trim())),
  SERVER_ERROR_DEBUG:
    StringBooleanFieldSchema('Server error flag').default(false),
});

export const RedisEnvironmentSchema = z.object({
  REDIS_URL: z.url().trim().nonempty(),
});

export const RuntimeEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  CI: StringBooleanFieldSchema('CI environment flag').default(false),
});

export const SmtpEnvironmentSchema = z.object({
  SMTP_HOST: z.string().trim().nonempty(),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: EmailFieldSchema(),
  SMTP_PASS: z.string().trim().nonempty(),
  SMTP_TLS_ENABLED: StringBooleanFieldSchema(),
});

export const EnvironmentSchema = z
  .object({
    REVISION: z.string().trim().optional().default('unspecified'),
  })
  .extend(DatabaseEnvironmentSchema.shape)
  .extend(RuntimeEnvironmentSchema.shape)
  .extend(LoggingEnvironmentSchema.shape)
  .extend(RedisEnvironmentSchema.shape)
  .extend(ServerEnvironmentSchema.shape)
  .extend(SmtpEnvironmentSchema.shape);
