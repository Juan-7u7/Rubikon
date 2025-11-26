// managers/InputSystem.ts
// Sistema unificado de input para teclado, mouse y touch

export type InputType = 'keyboard' | 'mouse' | 'touch' | 'gamepad';

export interface InputState {
  x: number;
  y: number;
  buttons: Set<string>;
  type: InputType;
}

export type InputCallback = (state: InputState) => void;

/**
 * Sistema centralizado de input
 */
export class InputSystem {
  private state: InputState;
  private callbacks: Set<InputCallback> = new Set();
  private keyState: Map<string, boolean> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.state = {
      x: 0,
      y: 0,
      buttons: new Set(),
      type: 'keyboard',
    };

    this.setupKeyboardListeners();
  }

  /**
   * Configura listeners de teclado
   */
  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Maneja keydown
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.enabled) return;

    const key = e.key.toLowerCase();
    this.keyState.set(key, true);
    this.state.buttons.add(key);
    this.updateMovementFromKeys();
  }

  /**
   * Maneja keyup
   */
  private handleKeyUp(e: KeyboardEvent): void {
    if (!this.enabled) return;

    const key = e.key.toLowerCase();
    this.keyState.set(key, false);
    this.state.buttons.delete(key);
    this.updateMovementFromKeys();
  }

  /**
   * Actualiza movimiento basado en teclas presionadas
   */
  private updateMovementFromKeys(): void {
    let x = 0;
    let y = 0;

    // WASD o Flechas
    if (this.keyState.get('w') || this.keyState.get('arrowup')) y = 1;
    if (this.keyState.get('s') || this.keyState.get('arrowdown')) y = -1;
    if (this.keyState.get('a') || this.keyState.get('arrowleft')) x = -1;
    if (this.keyState.get('d') || this.keyState.get('arrowright')) x = 1;

    // Normalizar movimiento diagonal
    if (x !== 0 && y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    this.state.x = x;
    this.state.y = y;
    this.state.type = 'keyboard';
    this.notifyCallbacks();
  }

  /**
   * Actualiza input desde joystick
   */
  updateFromJoystick(x: number, y: number): void {
    if (!this.enabled) return;

    this.state.x = x;
    this.state.y = y;
    this.state.type = 'touch';
    this.notifyCallbacks();
  }

  /**
   * Actualiza input desde mouse
   */
  updateFromMouse(x: number, y: number, buttons: string[]): void {
    if (!this.enabled) return;

    this.state.x = x;
    this.state.y = y;
    this.state.buttons = new Set(buttons);
    this.state.type = 'mouse';
    this.notifyCallbacks();
  }

  /**
   * Registra un callback para cambios de input
   */
  subscribe(callback: InputCallback): () => void {
    this.callbacks.add(callback);

    // Retornar función para desuscribirse
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Notifica a todos los callbacks
   */
  private notifyCallbacks(): void {
    this.callbacks.forEach((callback) => {
      callback({ ...this.state });
    });
  }

  /**
   * Obtiene el estado actual
   */
  getState(): InputState {
    return { ...this.state };
  }

  /**
   * Verifica si una tecla está presionada
   */
  isKeyPressed(key: string): boolean {
    return this.keyState.get(key.toLowerCase()) || false;
  }

  /**
   * Verifica si un botón está presionado
   */
  isButtonPressed(button: string): boolean {
    return this.state.buttons.has(button);
  }

  /**
   * Resetea el estado de input
   */
  reset(): void {
    this.state.x = 0;
    this.state.y = 0;
    this.state.buttons.clear();
    this.keyState.clear();
    this.notifyCallbacks();
  }

  /**
   * Habilita o deshabilita el input
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.reset();
    }
  }

  /**
   * Limpia recursos
   */
  dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.callbacks.clear();
    this.keyState.clear();
  }
}

export default InputSystem;
