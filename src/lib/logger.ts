// Утилита для логирования
export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const context = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const error = entry.error ? ` | ${entry.error.stack || entry.error.message}` : '';
    
    return `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${context}${error}`;
  }

  private log(level: string, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && { error }),
    };

    const formattedMessage = this.formatMessage(entry);

    // В продакшене отправляем в внешний сервис логирования
    if (!this.isDevelopment) {
      // Здесь можно добавить отправку в Sentry, LogRocket или другой сервис
      console.log(formattedMessage);
      return;
    }

    // В разработке выводим в консоль с цветами
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(`%c${formattedMessage}`, 'color: red; font-weight: bold;');
        break;
      case LOG_LEVELS.WARN:
        console.warn(`%c${formattedMessage}`, 'color: orange; font-weight: bold;');
        break;
      case LOG_LEVELS.INFO:
        console.info(`%c${formattedMessage}`, 'color: blue; font-weight: bold;');
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(`%c${formattedMessage}`, 'color: gray;');
        break;
      default:
        console.log(formattedMessage);
    }
  }

  error(message: string, context?: Record<string, unknown>, error?: Error) {
    this.log(LOG_LEVELS.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log(LOG_LEVELS.WARN, message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(LOG_LEVELS.INFO, message, context);
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      this.log(LOG_LEVELS.DEBUG, message, context);
    }
  }

  // Специальные методы для бизнес-логики
  leadCreated(leadId: string, leadData: Record<string, unknown>) {
    this.info('Lead created', { leadId, ...leadData });
  }

  leadUpdated(leadId: string, oldStatus: string, newStatus: string) {
    this.info('Lead status updated', { leadId, oldStatus, newStatus });
  }

  apiError(endpoint: string, error: Error, requestData?: Record<string, unknown>) {
    this.error(`API error in ${endpoint}`, { endpoint, requestData }, error);
  }

  securityEvent(event: string, details: Record<string, unknown>) {
    this.warn(`Security event: ${event}`, details);
  }
}

export const logger = new Logger();
