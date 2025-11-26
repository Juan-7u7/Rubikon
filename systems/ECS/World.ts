// systems/ECS/World.ts
// Mundo ECS que gestiona entidades y sistemas

import { Entity } from './Entity';
import { System } from './System';

/**
 * Mundo ECS que contiene todas las entidades y sistemas
 */
export class World {
  private entities: Map<number, Entity> = new Map();
  private systems: System[] = [];
  private lastTime: number = 0;

  /**
   * Crea una nueva entidad
   */
  createEntity(): Entity {
    const entity = new Entity();
    this.entities.set(entity.id, entity);
    
    // Agregar a sistemas relevantes
    this.systems.forEach((system) => {
      system.addEntity(entity);
    });

    return entity;
  }

  /**
   * Obtiene una entidad por ID
   */
  getEntity(id: number): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Destruye una entidad
   */
  destroyEntity(entity: Entity): void {
    // Remover de sistemas
    this.systems.forEach((system) => {
      system.removeEntity(entity);
    });

    // Destruir entidad
    entity.destroy();
    this.entities.delete(entity.id);
  }

  /**
   * Agrega un sistema al mundo
   */
  addSystem(system: System): void {
    this.systems.push(system);

    // Agregar entidades existentes al sistema
    this.entities.forEach((entity) => {
      system.addEntity(entity);
    });
  }

  /**
   * Remueve un sistema del mundo
   */
  removeSystem(system: System): void {
    const index = this.systems.indexOf(system);
    if (index !== -1) {
      this.systems.splice(index, 1);
      system.clear();
    }
  }

  /**
   * Obtiene todas las entidades
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Obtiene entidades que tienen componentes específicos
   */
  getEntitiesWithComponents(...componentClasses: any[]): Entity[] {
    return this.getAllEntities().filter((entity) =>
      componentClasses.every((componentClass) =>
        entity.hasComponent(componentClass)
      )
    );
  }

  /**
   * Actualiza todos los sistemas
   */
  update(currentTime: number = performance.now()): void {
    const deltaTime = this.lastTime === 0 ? 0 : (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.systems.forEach((system) => {
      system.update(deltaTime);
    });
  }

  /**
   * Limpia el mundo
   */
  clear(): void {
    this.entities.forEach((entity) => entity.destroy());
    this.entities.clear();
    this.systems.forEach((system) => system.clear());
    this.systems = [];
    this.lastTime = 0;
  }

  /**
   * Obtiene estadísticas del mundo
   */
  getStats(): {
    entityCount: number;
    systemCount: number;
    activeEntities: number;
  } {
    const activeEntities = this.getAllEntities().filter((e) => e.isActive()).length;
    
    return {
      entityCount: this.entities.size,
      systemCount: this.systems.length,
      activeEntities,
    };
  }
}

export default World;
