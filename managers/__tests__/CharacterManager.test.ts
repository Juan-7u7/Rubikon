// managers/__tests__/CharacterManager.test.ts
import * as THREE from 'three';
import { CharacterManager } from '../CharacterManager';

describe('CharacterManager', () => {
  let scene: THREE.Scene;
  let manager: CharacterManager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new CharacterManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('should create character', () => {
    const character = manager.getCharacter();
    expect(character).toBeDefined();
    expect(character).toBeInstanceOf(THREE.Group);
  });

  it('should add character to scene', () => {
    expect(scene.children.length).toBeGreaterThan(0);
  });

  it('should set target position', () => {
    manager.setTargetPosition(5, 0, 5);
    const position = manager.getPosition();
    
    // La posición actual no cambia inmediatamente (interpolación)
    expect(position).toBeDefined();
  });

  it('should limit movement to max distance', () => {
    // Intentar mover muy lejos
    manager.setTargetPosition(1000, 0, 1000);
    
    // Actualizar varias veces para que llegue al objetivo
    for (let i = 0; i < 100; i++) {
      manager.update();
    }
    
    const position = manager.getPosition();
    const distance = Math.sqrt(position.x ** 2 + position.z ** 2);
    
    // Debería estar limitado al máximo
    expect(distance).toBeLessThanOrEqual(96);
  });

  it('should update position smoothly', () => {
    const initialPos = manager.getPosition().clone();
    manager.setTargetPosition(10, 0, 10);
    
    manager.update();
    const newPos = manager.getPosition();
    
    // La posición debería haber cambiado
    expect(newPos.x).not.toBe(initialPos.x);
    expect(newPos.z).not.toBe(initialPos.z);
  });

  it('should rotate towards movement direction', () => {
    const initialRotation = manager.getCharacter().rotation.y;
    
    manager.setTargetPosition(10, 0, 0);
    
    // Actualizar varias veces
    for (let i = 0; i < 10; i++) {
      manager.update();
    }
    
    const newRotation = manager.getCharacter().rotation.y;
    
    // La rotación debería haber cambiado
    expect(newRotation).not.toBe(initialRotation);
  });

  it('should dispose properly', () => {
    const character = manager.getCharacter();
    const childrenCount = scene.children.length;
    
    manager.dispose();
    
    // El personaje debería haberse removido de la escena
    expect(scene.children.length).toBeLessThan(childrenCount);
  });
});
