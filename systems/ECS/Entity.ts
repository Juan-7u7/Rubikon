// systems/ECS/Entity.ts
// Sistema de Entidades para arquitectura ECS

import { Component } from './Component';

let nextEntityId = 0;

/**
 * Entidad en el sistema ECS
 * Una entidad es simplemente un ID con componentes adjuntos
 */
export class Entity {
  public readonly id: number;
  private components: Map<string, Component> = new Map();
  private active: boolean = true;

  constructor() {
    this.id = nextEntityId++;
  }

  /**
   * Agrega un componente a la entidad
   */
  addComponent<T extends Component>(component: T): this {
    this.components.set(component.constructor.name, component);
    return this;
  }

  /**
   * Obtiene un componente por tipo
   */
  getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T | undefined {
    return this.components.get(componentClass.name) as T | undefined;
  }

  /**
   * Verifica si tiene un componente
   */
  hasComponent<T extends Component>(componentClass: new (...args: any[]) => T): boolean {
    return this.components.has(componentClass.name);
  }

  /**
   * Remueve un componente
   */
  removeComponent<T extends Component>(componentClass: new (...args: any[]) => T): void {
    this.components.delete(componentClass.name);
  }

  /**
   * Obtiene todos los componentes
   */
  getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }

  /**
   * Activa/desactiva la entidad
   */
  setActive(active: boolean): void {
    this.active = active;
  }

  /**
   * Verifica si está activa
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Destruye la entidad
   */
  destroy(): void {
    this.components.clear();
    this.active = false;
  }
}
