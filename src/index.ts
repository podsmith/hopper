import { env } from '@/configs/environment';
import dataSource from '@/database/source';
import { server } from '@/server';

await dataSource.initialize();

const app = { port: env.SERVER_PORT, fetch: server.fetch };
export default app;
