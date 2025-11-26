// managers/CharacterManager.ts
// Gestor del personaje 3D (Fantasma de Caballero Medieval)

import * as THREE from 'three';
import { COLORS, MATERIALS, MOVEMENT, SIZES } from '../config/constants';

/**
 * Configuración del personaje
 */
export interface CharacterConfig {
  position?: THREE.Vector3;
  scale?: number;
}

/**
 * Manager para gestionar el personaje 3D
 */
export class CharacterManager {
  private character: THREE.Group;
  private targetPosition: THREE.Vector3;
  private currentPosition: THREE.Vector3;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, config?: CharacterConfig) {
    this.scene = scene;
    this.character = new THREE.Group();
    this.targetPosition = config?.position || new THREE.Vector3(0, 0, 0);
    this.currentPosition = new THREE.Vector3(0, 0, 0);
    
    this.createCharacter();
    this.scene.add(this.character);
  }

  /**
   * Crea el modelo del personaje (Fantasma de Caballero Medieval)
   */
  private createCharacter(): void {
    // Material fantasmal con transparencia y brillo
    const ghostMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.GHOST_BODY,
      roughness: MATERIALS.GHOST_ROUGHNESS,
      metalness: MATERIALS.GHOST_METALNESS,
      transparent: true,
      opacity: MATERIALS.GHOST_OPACITY,
      emissive: COLORS.GHOST_BODY,
      emissiveIntensity: MATERIALS.GHOST_EMISSIVE_INTENSITY,
    });

    // Material metálico para la armadura
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.ARMOR,
      roughness: MATERIALS.ARMOR_ROUGHNESS,
      metalness: MATERIALS.ARMOR_METALNESS,
      transparent: true,
      opacity: MATERIALS.ARMOR_OPACITY,
      emissive: COLORS.ARMOR,
      emissiveIntensity: MATERIALS.ARMOR_EMISSIVE_INTENSITY,
    });

    // CUERPO - Torso de armadura
    const torso = this.createTorso(armorMaterial);
    this.character.add(torso);

    // Peto (placa frontal)
    const chest = this.createChestPlate(armorMaterial);
    this.character.add(chest);

    // CABEZA - Casco de caballero
    const helmet = this.createHelmet(armorMaterial);
    this.character.add(helmet);

    // Visera del casco
    const visor = this.createVisor(armorMaterial);
    this.character.add(visor);

    // Cresta del casco
    const crest = this.createCrest();
    this.character.add(crest);

    // OJOS BRILLANTES
    const eyes = this.createEyes();
    eyes.forEach((eye) => this.character.add(eye));

    // BRAZOS - Hombreras y brazos
    const shoulders = this.createShoulders(armorMaterial);
    shoulders.forEach((shoulder) => this.character.add(shoulder));

    const arms = this.createArms(ghostMaterial);
    arms.forEach((arm) => this.character.add(arm));

    // PIERNAS
    const legs = this.createLegs(ghostMaterial);
    legs.forEach((leg) => this.character.add(leg));

    // CAPA FANTASMAL
    const cape = this.createCape();
    this.character.add(cape);

    // AURA FANTASMAL
    const aura = this.createAura();
    this.character.add(aura);

    // Sombra
    const shadow = this.createShadow();
    this.character.add(shadow);
  }

  private createTorso(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(
      SIZES.TORSO_WIDTH,
      SIZES.TORSO_HEIGHT,
      SIZES.TORSO_DEPTH
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.0;
    mesh.castShadow = true;
    return mesh;
  }

  private createChestPlate(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(0.55, 0.7, 0.05);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1.0, 0.23);
    return mesh;
  }

  private createHelmet(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(
      SIZES.HELMET_RADIUS,
      0.3,
      SIZES.HELMET_HEIGHT,
      8
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.7;
    mesh.castShadow = true;
    return mesh;
  }

  private createVisor(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(0.5, 0.15, 0.35);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1.65, 0.15);
    return mesh;
  }

  private createCrest(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(0.1, 0.3, 0.4);
    const material = new THREE.MeshStandardMaterial({
      color: COLORS.CREST,
      emissive: COLORS.CREST,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1.95, 0);
    return mesh;
  }

  private createEyes(): THREE.Mesh[] {
    const material = new THREE.MeshStandardMaterial({
      color: COLORS.EYES,
      emissive: COLORS.EYES,
      emissiveIntensity: MATERIALS.EYES_EMISSIVE_INTENSITY,
      transparent: true,
      opacity: MATERIALS.EYES_OPACITY,
    });
    const geometry = new THREE.SphereGeometry(SIZES.EYE_RADIUS, 16, 16);

    const leftEye = new THREE.Mesh(geometry, material);
    leftEye.position.set(0.12, 1.7, 0.25);

    const rightEye = new THREE.Mesh(geometry, material);
    rightEye.position.set(-0.12, 1.7, 0.25);

    return [leftEye, rightEye];
  }

  private createShoulders(material: THREE.Material): THREE.Mesh[] {
    const geometry = new THREE.SphereGeometry(SIZES.SHOULDER_RADIUS, 16, 16);

    const leftShoulder = new THREE.Mesh(geometry, material);
    leftShoulder.position.set(0.4, 1.3, 0);

    const rightShoulder = new THREE.Mesh(geometry, material);
    rightShoulder.position.set(-0.4, 1.3, 0);

    return [leftShoulder, rightShoulder];
  }

  private createArms(material: THREE.Material): THREE.Mesh[] {
    const geometry = new THREE.CapsuleGeometry(
      SIZES.ARM_RADIUS,
      SIZES.ARM_LENGTH,
      8,
      16
    );

    const leftArm = new THREE.Mesh(geometry, material);
    leftArm.position.set(0.4, 0.8, 0);

    const rightArm = new THREE.Mesh(geometry, material);
    rightArm.position.set(-0.4, 0.8, 0);

    return [leftArm, rightArm];
  }

  private createLegs(material: THREE.Material): THREE.Mesh[] {
    const geometry = new THREE.CylinderGeometry(
      SIZES.LEG_TOP_RADIUS,
      SIZES.LEG_BOTTOM_RADIUS,
      SIZES.LEG_HEIGHT,
      8
    );

    const leftLeg = new THREE.Mesh(geometry, material);
    leftLeg.position.set(0.15, 0.3, 0);

    const rightLeg = new THREE.Mesh(geometry, material);
    rightLeg.position.set(-0.15, 0.3, 0);

    return [leftLeg, rightLeg];
  }

  private createCape(): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(
      SIZES.CAPE_RADIUS,
      SIZES.CAPE_HEIGHT,
      8
    );
    const material = new THREE.MeshStandardMaterial({
      color: COLORS.CAPE,
      transparent: true,
      opacity: 0.5,
      emissive: COLORS.AURA,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1.2, -0.3);
    mesh.rotation.x = Math.PI;
    return mesh;
  }

  private createAura(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(SIZES.AURA_RADIUS, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: COLORS.AURA,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.0;
    return mesh;
  }

  private createShadow(): THREE.Mesh {
    const geometry = new THREE.CircleGeometry(SIZES.SHADOW_RADIUS, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.3,
      transparent: true,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.02;
    return mesh;
  }

  /**
   * Actualiza la posición objetivo del personaje
   */
  setTargetPosition(x: number, y: number, z: number): void {
    this.targetPosition.set(x, y, z);

    // Limitar movimiento a un área circular
    const distance = Math.sqrt(x * x + z * z);
    if (distance > MOVEMENT.MAX_DISTANCE) {
      const angle = Math.atan2(z, x);
      this.targetPosition.x = Math.cos(angle) * MOVEMENT.MAX_DISTANCE;
      this.targetPosition.z = Math.sin(angle) * MOVEMENT.MAX_DISTANCE;
    }
  }

  /**
   * Actualiza el personaje (llamar en el loop de animación)
   */
  update(): void {
    // Interpolación suave de posición
    this.currentPosition.lerp(this.targetPosition, MOVEMENT.INTERPOLATION);
    this.character.position.copy(this.currentPosition);

    // Rotación hacia la dirección de movimiento
    const direction = new THREE.Vector3().subVectors(
      this.targetPosition,
      this.currentPosition
    );

    if (direction.length() > 0.01) {
      const targetAngle = Math.atan2(direction.x, direction.z);
      const currentAngle = this.character.rotation.y;
      let angleDiff = targetAngle - currentAngle;

      // Normalizar ángulo
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      this.character.rotation.y += angleDiff * MOVEMENT.ROTATION_SPEED;
    }
  }

  /**
   * Obtiene el objeto 3D del personaje
   */
  getCharacter(): THREE.Group {
    return this.character;
  }

  /**
   * Obtiene la posición actual del personaje
   */
  getPosition(): THREE.Vector3 {
    return this.currentPosition.clone();
  }

  /**
   * Elimina el personaje de la escena
   */
  dispose(): void {
    this.scene.remove(this.character);
    this.character.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}

export default CharacterManager;
