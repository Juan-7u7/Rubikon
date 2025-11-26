// managers/__tests__/LightingManager.test.ts
import * as THREE from 'three';
import { LightingManager } from '../LightingManager';

describe('LightingManager', () => {
  let scene: THREE.Scene;
  let manager: LightingManager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new LightingManager(scene);
  });

  afterEach(() => {
    manager.removeAllLights();
  });

  it('should initialize default lighting', () => {
    manager.initializeDefaultLighting();
    
    const lights = manager.getAllLights();
    expect(lights.size).toBeGreaterThan(0);
  });

  it('should add ambient light', () => {
    const light = manager.addLight('test-ambient', {
      type: 'ambient',
      color: 0xffffff,
      intensity: 0.5,
    });
    
    expect(light).toBeInstanceOf(THREE.AmbientLight);
    expect(scene.children).toContain(light);
  });

  it('should add directional light', () => {
    const light = manager.addLight('test-directional', {
      type: 'directional',
      color: 0xffffff,
      intensity: 1.0,
      position: [10, 10, 10],
    });
    
    expect(light).toBeInstanceOf(THREE.DirectionalLight);
    expect(light.position.x).toBe(10);
    expect(light.position.y).toBe(10);
    expect(light.position.z).toBe(10);
  });

  it('should add hemisphere light', () => {
    const light = manager.addLight('test-hemisphere', {
      type: 'hemisphere',
      color: 0x87ceeb,
      intensity: 0.6,
      skyColor: 0x87ceeb,
      groundColor: 0x90ee90,
    });
    
    expect(light).toBeInstanceOf(THREE.HemisphereLight);
  });

  it('should get light by name', () => {
    manager.addLight('test-light', {
      type: 'ambient',
      color: 0xffffff,
      intensity: 0.5,
    });
    
    const light = manager.getLight('test-light');
    expect(light).toBeDefined();
  });

  it('should update light intensity', () => {
    const light = manager.addLight('test-light', {
      type: 'ambient',
      color: 0xffffff,
      intensity: 0.5,
    });
    
    manager.setLightIntensity('test-light', 1.0);
    expect(light.intensity).toBe(1.0);
  });

  it('should update light color', () => {
    const light = manager.addLight('test-light', {
      type: 'ambient',
      color: 0xffffff,
      intensity: 0.5,
    });
    
    manager.setLightColor('test-light', 0xff0000);
    expect(light.color.getHex()).toBe(0xff0000);
  });

  it('should remove light', () => {
    manager.addLight('test-light', {
      type: 'ambient',
      color: 0xffffff,
      intensity: 0.5,
    });
    
    const initialCount = scene.children.length;
    manager.removeLight('test-light');
    
    expect(scene.children.length).toBe(initialCount - 1);
    expect(manager.getLight('test-light')).toBeUndefined();
  });

  it('should remove all lights', () => {
    manager.addLight('light1', {
      type: 'ambient',
      color: 0xffffff,
      intensity: 0.5,
    });
    
    manager.addLight('light2', {
      type: 'directional',
      color: 0xffffff,
      intensity: 1.0,
    });
    
    manager.removeAllLights();
    
    expect(manager.getAllLights().size).toBe(0);
  });
});
