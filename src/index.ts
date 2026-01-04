// oxlint-disable prefer-await-to-then
import { env } from '@/configs/environment';
import dataSource from '@/database/source';
import { server } from '@/server';
import logger from '@/utils/logger';

dataSource
  .initialize()
  .then(() => {
    logger.info('started the server on the designated port');
  })
  .catch((error) => {
    logger.error(
      'failed to start the server due to error establishing database connection',
      {
        error,
      },
    );
  });

const app = { port: env.SERVER_PORT, fetch: server.fetch };
export default app;
