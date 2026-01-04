import { EnvironmentSchema } from '@/validators/schemas/environment';

const result = EnvironmentSchema.safeParse(process.env);

/* c8 ignore start */
if (result.error) {
  // oxlint-disable-next-line no-console
  console.error(result.error);
  // oxlint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}
/* c8 ignore end */

export const env = result.data;
