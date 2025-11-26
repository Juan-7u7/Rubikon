// utils/Analytics.ts
// Sistema de analytics y tracking de eventos

import { logger } from './logger';
import { platformAdapter } from './PlatformAdapter';

/**
 * Tipos de eventos
 */
export enum EventType {
  // Juego
  GAME_START = 'game_start',
  GAME_END = 'game_end',
  GAME_PAUSE = 'game_pause',
  GAME_RESUME = 'game_resume',
  
  // Jugador
  PLAYER_MOVE = 'player_move',
  PLAYER_LEVEL_UP = 'player_level_up',
  PLAYER_SCORE = 'player_score',
  
  // UI
  BUTTON_CLICK = 'button_click',
  SCREEN_VIEW = 'screen_view',
  MODAL_OPEN = 'modal_open',
  MODAL_CLOSE = 'modal_close',
  
  // Performance
  FPS_DROP = 'fps_drop',
  LOAD_TIME = 'load_time',
  ERROR = 'error',
  
  // Custom
  CUSTOM = 'custom',
}

/**
 * Propiedades de un evento
 */
export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Evento de analytics
 */
export interface AnalyticsEvent {
  type: EventType;
  timestamp: number;
  properties: EventProperties;
  sessionId: string;
  userId?: string;
}

/**
 * Configuración de analytics
 */
export interface AnalyticsConfig {
  enabled?: boolean;
  debug?: boolean;
  batchSize?: number;
  flushInterval?: number;
  endpoint?: string;
}

/**
 * Sistema de Analytics
 */
export class Analytics {
  private static instance: Analytics;
  private config: Required<AnalyticsConfig>;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private flushTimer?: number;

  private constructor(config: AnalyticsConfig = {}) {
    this.config = {
      enabled: config.enabled ?? __DEV__ === false, // Solo en producción por defecto
      debug: config.debug ?? __DEV__,
      batchSize: config.batchSize ?? 10,
      flushInterval: config.flushInterval ?? 30000, // 30 segundos
      endpoint: config.endpoint ?? '/api/analytics',
    };

    this.sessionId = this.generateSessionId();
    this.startFlushTimer();

    logger.info('Analytics initialized', {
      sessionId: this.sessionId,
      enabled: this.config.enabled,
    });
  }

  /**
   * Obtiene la instancia singleton
   */
  static getInstance(config?: AnalyticsConfig): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics(config);
    }
    return Analytics.instance;
  }

  /**
   * Genera un ID de sesión único
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Establece el ID de usuario
   */
  setUserId(userId: string): void {
    this.userId = userId;
    logger.debug('User ID set', { userId });
  }

  /**
   * Trackea un evento
   */
  track(type: EventType, properties: EventProperties = {}): void {
    if (!this.config.enabled) {
      if (this.config.debug) {
        logger.debug('Analytics event (not sent):', { type, properties });
      }
      return;
    }

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      properties: {
        ...properties,
        platform: platformAdapter.getPlatformInfo().type,
        isMobile: platformAdapter.isMobile(),
      },
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.events.push(event);

    if (this.config.debug) {
      logger.debug('Analytics event tracked:', event);
    }

    // Flush si alcanzamos el tamaño del batch
    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Trackea inicio de juego
   */
  trackGameStart(): void {
    this.track(EventType.GAME_START, {
      timestamp: Date.now(),
    });
  }

  /**
   * Trackea fin de juego
   */
  trackGameEnd(score: number, playTime: number): void {
    this.track(EventType.GAME_END, {
      score,
      playTime,
    });
  }

  /**
   * Trackea vista de pantalla
   */
  trackScreenView(screenName: string): void {
    this.track(EventType.SCREEN_VIEW, {
      screenName,
    });
  }

  /**
   * Trackea click de botón
   */
  trackButtonClick(buttonName: string, location?: string): void {
    this.track(EventType.BUTTON_CLICK, {
      buttonName,
      location,
    });
  }

  /**
   * Trackea error
   */
  trackError(error: Error, context?: string): void {
    this.track(EventType.ERROR, {
      errorMessage: error.message,
      errorStack: error.stack,
      context,
    });
  }

  /**
   * Trackea performance
   */
  trackPerformance(metric: string, value: number): void {
    this.track(EventType.CUSTOM, {
      metric,
      value,
      category: 'performance',
    });
  }

  /**
   * Trackea tiempo de carga
   */
  trackLoadTime(resource: string, duration: number): void {
    this.track(EventType.LOAD_TIME, {
      resource,
      duration,
    });
  }

  /**
   * Envía eventos al servidor
   */
  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    if (this.config.debug) {
      logger.debug(`Flushing ${eventsToSend.length} analytics events`);
    }

    try {
      // Aquí enviarías los eventos a tu backend
      // Por ahora solo los logueamos
      if (this.config.endpoint) {
        await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events: eventsToSend }),
        });
      }

      logger.info(`Analytics events sent: ${eventsToSend.length}`);
    } catch (error) {
      logger.error('Failed to send analytics events', error);
      // Volver a agregar eventos a la cola
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * Inicia el timer de flush automático
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval) as unknown as number;
  }

  /**
   * Habilita/deshabilita analytics
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    logger.info(`Analytics ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Obtiene estadísticas
   */
  getStats(): {
    sessionId: string;
    userId?: string;
    queuedEvents: number;
    enabled: boolean;
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      queuedEvents: this.events.length,
      enabled: this.config.enabled,
    };
  }

  /**
   * Limpia eventos pendientes y detiene timers
   */
  dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Enviar eventos pendientes
    this.events = [];
  }
}

// Exportar instancia singleton
export const analytics = Analytics.getInstance();

export default analytics;
