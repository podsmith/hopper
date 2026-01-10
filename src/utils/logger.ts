// oxlint-disable typescript/no-unsafe-assignment
// oxlint-disable typescript/no-unsafe-return
// oxlint-disable no-unsafe-member-access
import dotenv from 'dotenv-flow';
import { createLogger, format, transports } from 'winston';

import { StringBooleanFieldSchema } from '@/validators/common/field';

dotenv.config({ purge_dotenv: true, silent: true });

Object.defineProperty(Error.prototype, 'toJSON', {
  value: function () {
    // oxlint-disable-next-line prefer-object-spread
    return Object.assign({}, this, {
      error: {
        name: this.name,
        message: this.message,
        stack: this.stack,
        issues: this?.issues,
      },
    });
  },
  writable: false,
  configurable: false,
});

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
