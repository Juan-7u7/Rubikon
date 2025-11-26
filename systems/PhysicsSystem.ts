// systems/PhysicsSystem.ts
// Sistema básico de física y colisiones

import * as THREE from 'three';
import { logger } from '../utils/logger';

/**
 * Cuerpo físico
 */
export interface PhysicsBody {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  radius: number;
  isStatic: boolean;
  restitution: number; // Coeficiente de rebote (0-1)
  friction: number; // Coeficiente de fricción (0-1)
  onCollision?: (other: PhysicsBody) => void;
}

/**
 * Sistema de física básico
 */
export class PhysicsSystem {
  private bodies: Map<string, PhysicsBody> = new Map();
  private gravity: THREE.Vector3;
  private enabled: boolean = true;

  constructor(gravity: THREE.Vector3 = new THREE.Vector3(0, -9.8, 0)) {
    this.gravity = gravity;
  }

  /**
   * Agrega un cuerpo físico
   */
  addBody(body: PhysicsBody): void {
    this.bodies.set(body.id, body);
    logger.debug(`Physics body added: ${body.id}`);
  }

  /**
   * Remueve un cuerpo físico
   */
  removeBody(id: string): void {
    this.bodies.delete(id);
    logger.debug(`Physics body removed: ${id}`);
  }

  /**
   * Obtiene un cuerpo físico
   */
  getBody(id: string): PhysicsBody | undefined {
    return this.bodies.get(id);
  }

  /**
   * Actualiza la física (llamar cada frame)
   */
  update(deltaTime: number): void {
    if (!this.enabled) return;

    // Actualizar cada cuerpo
    this.bodies.forEach((body) => {
      if (body.isStatic) return;

      // Aplicar gravedad
      body.acceleration.add(this.gravity);

      // Actualizar velocidad
      body.velocity.add(
        body.acceleration.clone().multiplyScalar(deltaTime)
      );

      // Aplicar fricción
      body.velocity.multiplyScalar(1 - body.friction * deltaTime);

      // Actualizar posición
      body.position.add(
        body.velocity.clone().multiplyScalar(deltaTime)
      );

      // Resetear aceleración
      body.acceleration.set(0, 0, 0);
    });

    // Detectar colisiones
    this.detectCollisions();
  }

  /**
   * Detecta y resuelve colisiones
   */
  private detectCollisions(): void {
    const bodies = Array.from(this.bodies.values());

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const bodyA = bodies[i];
        const bodyB = bodies[j];

        // No colisionar dos objetos estáticos
        if (bodyA.isStatic && bodyB.isStatic) continue;

        // Detectar colisión esférica
        const distance = bodyA.position.distanceTo(bodyB.position);
        const minDistance = bodyA.radius + bodyB.radius;

        if (distance < minDistance) {
          this.resolveCollision(bodyA, bodyB, distance, minDistance);
        }
      }
    }
  }

  /**
   * Resuelve una colisión entre dos cuerpos
   */
  private resolveCollision(
    bodyA: PhysicsBody,
    bodyB: PhysicsBody,
    distance: number,
    minDistance: number
  ): void {
    // Calcular normal de colisión
    const normal = new THREE.Vector3()
      .subVectors(bodyB.position, bodyA.position)
      .normalize();

    // Separar cuerpos
    const overlap = minDistance - distance;
    const separation = normal.clone().multiplyScalar(overlap / 2);

    if (!bodyA.isStatic) {
      bodyA.position.sub(separation);
    }
    if (!bodyB.isStatic) {
      bodyB.position.add(separation);
    }

    // Calcular velocidad relativa
    const relativeVelocity = new THREE.Vector3()
      .subVectors(bodyB.velocity, bodyA.velocity);

    const velocityAlongNormal = relativeVelocity.dot(normal);

    // No resolver si los cuerpos se están separando
    if (velocityAlongNormal > 0) return;

    // Calcular impulso
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    const totalMass = bodyA.isStatic ? bodyB.mass : 
                      bodyB.isStatic ? bodyA.mass : 
                      bodyA.mass + bodyB.mass;
    const impulse = normal.clone().multiplyScalar(impulseScalar / totalMass);

    // Aplicar impulso
    if (!bodyA.isStatic) {
      bodyA.velocity.sub(impulse.clone().multiplyScalar(bodyB.mass));
    }
    if (!bodyB.isStatic) {
      bodyB.velocity.add(impulse.clone().multiplyScalar(bodyA.mass));
    }

    // Llamar callbacks de colisión
    if (bodyA.onCollision) bodyA.onCollision(bodyB);
    if (bodyB.onCollision) bodyB.onCollision(bodyA);

    logger.debug(`Collision: ${bodyA.id} <-> ${bodyB.id}`);
  }

  /**
   * Aplica una fuerza a un cuerpo
   */
  applyForce(id: string, force: THREE.Vector3): void {
    const body = this.bodies.get(id);
    if (body && !body.isStatic) {
      // F = ma, entonces a = F/m
      const acceleration = force.clone().divideScalar(body.mass);
      body.acceleration.add(acceleration);
    }
  }

  /**
   * Aplica un impulso a un cuerpo
   */
  applyImpulse(id: string, impulse: THREE.Vector3): void {
    const body = this.bodies.get(id);
    if (body && !body.isStatic) {
      // Impulso cambia velocidad directamente
      const velocityChange = impulse.clone().divideScalar(body.mass);
      body.velocity.add(velocityChange);
    }
  }

  /**
   * Raycast simple
   */
  raycast(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    maxDistance: number = Infinity
  ): { body: PhysicsBody; distance: number } | null {
    let closestHit: { body: PhysicsBody; distance: number } | null = null;
    let closestDistance = maxDistance;

    this.bodies.forEach((body) => {
      // Intersección rayo-esfera
      const oc = new THREE.Vector3().subVectors(origin, body.position);
      const a = direction.dot(direction);
      const b = 2.0 * oc.dot(direction);
      const c = oc.dot(oc) - body.radius * body.radius;
      const discriminant = b * b - 4 * a * c;

      if (discriminant >= 0) {
        const distance = (-b - Math.sqrt(discriminant)) / (2.0 * a);
        if (distance > 0 && distance < closestDistance) {
          closestDistance = distance;
          closestHit = { body, distance };
        }
      }
    });

    return closestHit;
  }

  /**
   * Habilita/deshabilita la física
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Cambia la gravedad
   */
  setGravity(gravity: THREE.Vector3): void {
    this.gravity = gravity;
  }

  /**
   * Limpia todos los cuerpos
   */
  clear(): void {
    this.bodies.clear();
  }

  /**
   * Obtiene estadísticas
   */
  getStats(): {
    bodyCount: number;
    staticBodies: number;
    dynamicBodies: number;
  } {
    const bodies = Array.from(this.bodies.values());
    const staticBodies = bodies.filter((b) => b.isStatic).length;
    
    return {
      bodyCount: this.bodies.size,
      staticBodies,
      dynamicBodies: this.bodies.size - staticBodies,
    };
  }
}

export default PhysicsSystem;
