// oxlint-disable typescript/no-unsafe-assignment
// oxlint-disable typescript/no-unsafe-return
// oxlint-disable no-unsafe-member-access
import { createLogger, format, transports } from 'winston';
import DailyRotateFile, {
  type DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';

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

const simpleLogFormat = format.combine(
  format.colorize(),
  format.align(),
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    const m = typeof message === 'string' ? message : JSON.stringify(message);
    // oxlint-disable-next-line typescript/restrict-template-expressions
    return `[${timestamp}] ${level} ${m}`;
  }),
);

const consoleLogTransport = new transports.Console({
  format: env.LOG_ENABLE_CONTAINER_ONLY ? jsonLogFormat : simpleLogFormat,
  level: 'debug',
  silent: env.LOG_SILENCE,
});

const logger = createLogger({
  transports: [consoleLogTransport],
  handleExceptions: true,
  handleRejections: true,
});

if (!env.LOG_ENABLE_CONTAINER_ONLY) {
  const logRotationConfig: DailyRotateFileTransportOptions = {
    format: jsonLogFormat,
    zippedArchive: true,
    maxFiles: env.LOG_RETENTION_DAYS,
    json: true,
    datePattern: 'YYYY-MM-DD-HH',
    utc: true,
    filename: '%DATE%.log',
  };

  const errorFileLogTransport = new DailyRotateFile({
    ...logRotationConfig,
    level: 'error',
    dirname: 'logs/error',
    silent: env.LOG_ENABLE_CONTAINER_ONLY,
  });

  const debugFileLogTransport = new DailyRotateFile({
    ...logRotationConfig,
    level: 'debug',
    dirname: 'logs/debug',
    silent: env.LOG_ENABLE_CONTAINER_ONLY,
  });

  logger.add(errorFileLogTransport);
  logger.add(debugFileLogTransport);
}

export default logger;
