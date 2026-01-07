import { createLogger, format, transports } from 'winston';

import { StringBooleanFieldSchema } from '@/validators/common/field';

const jsonLogFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json({ space: 0 }),
);

const consoleLogTransport = new transports.Console({
  format: jsonLogFormat,
  level: 'debug',
  silent: StringBooleanFieldSchema('Log silence flag').parse(
    process.env.LOG_SILENCE,
  ),
});

const logger = createLogger({
  transports: [consoleLogTransport],
  handleExceptions: true,
  handleRejections: true,
});

export default logger;
