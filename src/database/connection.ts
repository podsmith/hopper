import { Kysely } from 'kysely';

import { kyselyConfig } from '@/configs/database';
import type { DB } from '@/database/schema';

export const dbConn = new Kysely<DB>(kyselyConfig);
