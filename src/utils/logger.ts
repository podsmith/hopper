import { createLogger, format, transports } from 'winston';

const jsonLogFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json({ space: 0 }),
);

const consoleLogTransport = new transports.Console({
  format: jsonLogFormat,
  level: 'debug',
  silent: process.env.LOG_SILENCE === 'true',
});

const logger = createLogger({
  transports: [consoleLogTransport],
  handleExceptions: true,
  handleRejections: true,
});

export default logger;
