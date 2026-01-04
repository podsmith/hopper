// oxlint-disable prefer-await-to-then
import { env } from '@/configs/environment';
import dataSource from '@/database/source';
import { server } from '@/server';
import logger from '@/utils/logger';

dataSource
  .initialize()
  .then(() => {
    server.listen(env.SERVER_PORT);

    process.on('SIGINT', () => {
      server.close();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      server.close((err) => {
        if (err) {
          process.exit(1);
        }
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    logger.error(
      'failed to start the server due to error establishing database connection',
      {
        error,
      },
    );
  });
