type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private createEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, any>
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console[entry.level](
        `[${entry.timestamp}] ${entry.level.toUpperCase()} ${entry.context ? `[${entry.context}] ` : ''}${entry.message}`,
        entry.metadata || ''
      );
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.addLog(this.createEntry('debug', message, context, metadata));
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    this.addLog(this.createEntry('info', message, context, metadata));
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.addLog(this.createEntry('warn', message, context, metadata));
  }

  error(message: string, context?: string, metadata?: Record<string, any>) {
    this.addLog(this.createEntry('error', message, context, metadata));
  }

  getLogs(level?: LogLevel, context?: string): LogEntry[] {
    return this.logs.filter(
      log => (!level || log.level === level) && (!context || log.context === context)
    );
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
