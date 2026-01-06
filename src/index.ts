import type { Server } from 'bun';

import { env } from '@/configs/environment';
import { server } from '@/server';

const app: Partial<Server<unknown>> = {
  port: env.SERVER_PORT,
  fetch: server.fetch,
};

export default app;
