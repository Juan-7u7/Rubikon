// systems/ECS/System.ts
// Sistema base para ECS

import { Component } from './Component';
import { Entity } from './Entity';

/**
 * Sistema base para ECS
 * Los sistemas contienen la lógica que opera sobre entidades con componentes específicos
 */
export abstract class System {
  protected entities: Set<Entity> = new Set();

  /**
   * Define qué componentes requiere este sistema
   */
  abstract requiredComponents(): (new (...args: any[]) => Component)[];

  /**
   * Verifica si una entidad es válida para este sistema
   */
  isEntityValid(entity: Entity): boolean {
    return this.requiredComponents().every((component) =>
      entity.hasComponent(component)
    );
  }

  /**
   * Agrega una entidad al sistema
   */
  addEntity(entity: Entity): void {
    if (this.isEntityValid(entity)) {
      this.entities.add(entity);
    }
  }

  /**
   * Remueve una entidad del sistema
   */
  removeEntity(entity: Entity): void {
    this.entities.delete(entity);
  }

  /**
   * Actualiza el sistema (llamar cada frame)
   */
  abstract update(deltaTime: number): void;

  /**
   * Obtiene todas las entidades del sistema
   */
  getEntities(): Entity[] {
    return Array.from(this.entities);
  }

  /**
   * Limpia el sistema
   */
  clear(): void {
    this.entities.clear();
  }
}

/**
 * Sistema de movimiento
 */
export class MovementSystem extends System {
  requiredComponents() {
    const { PositionComponent, VelocityComponent } = require('./Component');
    return [PositionComponent, VelocityComponent];
  }

  update(deltaTime: number): void {
    const { PositionComponent, VelocityComponent } = require('./Component');
    
    this.entities.forEach((entity) => {
      if (!entity.isActive()) return;

      const position = entity.getComponent(PositionComponent);
      const velocity = entity.getComponent(VelocityComponent);

      if (position && velocity) {
        position.x += velocity.x * deltaTime;
        position.y += velocity.y * deltaTime;
        position.z += velocity.z * deltaTime;
      }
    });
  }
}

/**
 * Sistema de renderizado
 */
export class RenderSystem extends System {
  requiredComponents() {
    const { PositionComponent, RenderComponent } = require('./Component');
    return [PositionComponent, RenderComponent];
  }

  update(_deltaTime: number): void {
    const { PositionComponent, RenderComponent } = require('./Component');
    
    this.entities.forEach((entity) => {
      if (!entity.isActive()) return;

      const position = entity.getComponent(PositionComponent);
      const render = entity.getComponent(RenderComponent);

      if (position && render && render.mesh) {
        render.mesh.position.set(position.x, position.y, position.z);
      }
    });
  }
}
