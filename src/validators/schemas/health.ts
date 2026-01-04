import * as z from 'zod';

import { TimestampFieldSchema } from '@/validators/common/field';

export const GetHealthStatusResponseSchema = z.object({
  isHealthy: z.boolean(),
  timestamp: TimestampFieldSchema('Timestamp'),
});
