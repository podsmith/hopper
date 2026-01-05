import type { Server } from 'bun';

import { env } from '@/configs/environment';
import dataSource from '@/database/source';
import { server } from '@/server';

const app: Partial<Server<unknown>> = {
  port: env.SERVER_PORT,
  fetch: server.fetch,
};

await dataSource.initialize();

export default app;
