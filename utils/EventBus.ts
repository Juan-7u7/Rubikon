// utils/EventBus.ts
// Sistema de eventos para comunicación desacoplada entre componentes

type EventCallback = (...args: any[]) => void;

/**
 * EventBus para comunicación entre componentes sin acoplamiento directo
 */
export class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();
  private onceEvents: Map<string, Set<EventCallback>> = new Map();

  /**
   * Suscribe un callback a un evento
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(callback);

    // Retornar función para desuscribirse
    return () => this.off(event, callback);
  }

  /**
   * Suscribe un callback que solo se ejecutará una vez
   */
  once(event: string, callback: EventCallback): () => void {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, new Set());
    }

    this.onceEvents.get(event)!.add(callback);

    return () => {
      const callbacks = this.onceEvents.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Desuscribe un callback de un evento
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Emite un evento con argumentos opcionales
   */
  emit(event: string, ...args: any[]): void {
    // Ejecutar callbacks normales
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event callback for "${event}":`, error);
        }
      });
    }

    // Ejecutar callbacks "once" y luego eliminarlos
    const onceCallbacks = this.onceEvents.get(event);
    if (onceCallbacks) {
      onceCallbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in once event callback for "${event}":`, error);
        }
      });
      this.onceEvents.delete(event);
    }
  }

  /**
   * Elimina todos los listeners de un evento
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
      this.onceEvents.delete(event);
    } else {
      this.events.clear();
      this.onceEvents.clear();
    }
  }

  /**
   * Obtiene el número de listeners para un evento
   */
  listenerCount(event: string): number {
    const normalCount = this.events.get(event)?.size || 0;
    const onceCount = this.onceEvents.get(event)?.size || 0;
    return normalCount + onceCount;
  }

  /**
   * Obtiene todos los nombres de eventos registrados
   */
  eventNames(): string[] {
    const names = new Set<string>();
    this.events.forEach((_, key) => names.add(key));
    this.onceEvents.forEach((_, key) => names.add(key));
    return Array.from(names);
  }
}

// Exportar instancia singleton para uso global
export const eventBus = new EventBus();

// Eventos predefinidos del juego
export const GameEvents = {
  // Personaje
  CHARACTER_MOVED: 'character:moved',
  CHARACTER_STOPPED: 'character:stopped',
  CHARACTER_ROTATED: 'character:rotated',

  // Cámara
  CAMERA_MODE_CHANGED: 'camera:mode_changed',
  CAMERA_MOVED: 'camera:moved',

  // Input
  INPUT_CHANGED: 'input:changed',
  JOYSTICK_MOVED: 'joystick:moved',
  KEYBOARD_INPUT: 'keyboard:input',

  // Juego
  GAME_STARTED: 'game:started',
  GAME_PAUSED: 'game:paused',
  GAME_RESUMED: 'game:resumed',
  GAME_OVER: 'game:over',

  // Recursos
  MODEL_LOADED: 'model:loaded',
  MODEL_LOAD_ERROR: 'model:load_error',
  ASSET_LOADED: 'asset:loaded',

  // UI
  UI_BUTTON_CLICKED: 'ui:button_clicked',
  UI_MODAL_OPENED: 'ui:modal_opened',
  UI_MODAL_CLOSED: 'ui:modal_closed',
} as const;

export default eventBus;
