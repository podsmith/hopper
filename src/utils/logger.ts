// oxlint-disable typescript/no-unsafe-assignment
// oxlint-disable typescript/no-unsafe-return
// oxlint-disable no-unsafe-member-access
import { createLogger, format, transports } from 'winston';

import { env } from '@/configs/environment';

Object.defineProperty(Error.prototype, 'toJSON', {
  value: function () {
    // oxlint-disable-next-line prefer-object-spread
    return Object.assign({}, this, {
      name: this.name,
      message: this.message,
      stack: this.stack,
      issues: this?.issues,
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
  silent: env.LOG_SILENCE,
});

const logger = createLogger({
  transports: [consoleLogTransport],
  handleExceptions: true,
  handleRejections: true,
});

export default logger;
