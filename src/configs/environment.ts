import logger from '@/utils/logger';
import { EnvironmentSchema } from '@/validators/schemas/environment';

const result = EnvironmentSchema.safeParse(process.env);

/* istanbul ignore if -- @preserve */
if (result.error) {
  logger.error(
    'could not validate the environment variables for database connection',
    result.error,
  );
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

export const env = result.data;
