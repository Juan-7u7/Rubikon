// systems/ECS/Component.ts
// Componente base para ECS

/**
 * Componente base para el sistema ECS
 * Los componentes son solo datos, sin lógica
 */
export abstract class Component {
  public enabled: boolean = true;

  /**
   * Inicializa el componente
   */
  init?(): void;

  /**
   * Limpia el componente
   */
  destroy?(): void;
}

/**
 * Componente de posición 3D
 */
export class PositionComponent extends Component {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
    super();
  }

  set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

/**
 * Componente de velocidad
 */
export class VelocityComponent extends Component {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
    super();
  }

  set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

/**
 * Componente de rotación
 */
export class RotationComponent extends Component {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
    super();
  }
}

/**
 * Componente de renderizado 3D
 */
export class RenderComponent extends Component {
  constructor(public mesh: any) {
    super();
  }
}

/**
 * Componente de input
 */
export class InputComponent extends Component {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {
    super();
  }
}

/**
 * Componente de colisión
 */
export class CollisionComponent extends Component {
  constructor(
    public radius: number = 1,
    public layer: string = 'default'
  ) {
    super();
  }
}

/**
 * Componente de salud
 */
export class HealthComponent extends Component {
  constructor(
    public current: number = 100,
    public max: number = 100
  ) {
    super();
  }

  damage(amount: number): void {
    this.current = Math.max(0, this.current - amount);
  }

  heal(amount: number): void {
    this.current = Math.min(this.max, this.current + amount);
  }

  isDead(): boolean {
    return this.current <= 0;
  }
}
