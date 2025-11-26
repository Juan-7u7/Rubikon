// utils/logger.ts
// Sistema centralizado de logging para debugging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

/**
 * Logger centralizado para la aplicación
 */
class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private enabled = __DEV__;

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, data?: any): void {
    if (!this.enabled) return;
    this.log('debug', message, data);
    console.log(`🔍 [DEBUG] ${message}`, data || '');
  }

  /**
   * Log de información
   */
  info(message: string, data?: any): void {
    if (!this.enabled) return;
    this.log('info', message, data);
    console.log(`ℹ️ [INFO] ${message}`, data || '');
  }

  /**
   * Log de advertencia
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
    console.warn(`⚠️ [WARN] ${message}`, data || '');
  }

  /**
   * Log de error
   */
  error(message: string, error?: any): void {
    this.log('error', message, error);
    console.error(`❌ [ERROR] ${message}`, error || '');
  }

  /**
   * Log de performance
   */
  performance(label: string, duration: number): void {
    if (!this.enabled) return;
    this.info(`⏱️ Performance: ${label}`, `${duration.toFixed(2)}ms`);
  }

  /**
   * Inicia un timer de performance
   */
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.performance(label, duration);
    };
  }

  /**
   * Log de evento del juego
   */
  gameEvent(event: string, data?: any): void {
    if (!this.enabled) return;
    this.info(`🎮 Game Event: ${event}`, data);
  }

  /**
   * Log de red/API
   */
  network(method: string, url: string, status?: number, data?: any): void {
    if (!this.enabled) return;
    const statusEmoji = status && status >= 200 && status < 300 ? '✅' : '❌';
    this.info(`${statusEmoji} Network: ${method} ${url}`, { status, data });
  }

  /**
   * Almacena un log en el historial
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
    };

    this.logs.push(entry);

    // Mantener solo los últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Obtiene el historial de logs
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * Limpia el historial de logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Habilita o deshabilita el logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Exporta logs como JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Agrupa logs relacionados
   */
  group(label: string, callback: () => void): void {
    if (!this.enabled) {
      callback();
      return;
    }
    console.group(label);
    callback();
    console.groupEnd();
  }
}

// Exportar instancia singleton
export const logger = new Logger();

// Exportar clase para testing
export { Logger };

export default logger;
