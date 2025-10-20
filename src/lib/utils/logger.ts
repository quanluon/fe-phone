import pino from 'pino';

const isServer = typeof window === 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Pino logger instance configured for the Next.js application
 * 
 * In development: Uses pino-pretty for human-readable output
 * In production: Uses JSON format for structured logging
 * 
 * Handles both server-side and client-side logging
 */
export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  browser: {
    asObject: true,
    serialize: true,
    transmit: {
      level: 'info',
      send: function (level, logEvent) {
        if (typeof window !== 'undefined' && isDevelopment) {
          // In development, use browser console with better formatting
          const msg = logEvent.messages[0];
          const bindings = logEvent.bindings.reduce((acc, binding) => {
            return { ...acc, ...binding };
          }, {});
          
          const data = { ...bindings, ...msg };
          
          // Use appropriate console method based on level
          switch (level) {
            case 'fatal':
            case 'error':
              console.error(data);
              break;
            case 'warn':
              console.warn(data);
              break;
            case 'debug':
            case 'trace':
              console.debug(data);
              break;
            default:
              console.log(data);
          }
        }
      },
    },
  },
  ...(isServer && isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
});

/**
 * Create a child logger with additional context
 * @param context - Additional context to include in all log messages
 */
export const createLogger = (context: Record<string, unknown>) => {
  return logger.child(context);
};

export default logger;

