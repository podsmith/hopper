import type { Server } from 'bun';

import { app } from '@/app';
import { env } from '@/configs/environment';

const server: Partial<Server<unknown>> = {
  port: env.SERVER_PORT,
  fetch: app.fetch,
};

export default server;
