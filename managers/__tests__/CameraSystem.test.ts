// managers/__tests__/CameraSystem.test.ts
import * as THREE from 'three';
import { CameraSystem } from '../CameraSystem';

// Mock del DOM
const createMockContainer = () => {
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.height = '600px';
  Object.defineProperty(container, 'clientWidth', { value: 800 });
  Object.defineProperty(container, 'clientHeight', { value: 600 });
  return container;
};

describe('CameraSystem', () => {
  let container: HTMLElement;
  let cameraSystem: CameraSystem;

  beforeEach(() => {
    container = createMockContainer();
    document.body.appendChild(container);
    cameraSystem = new CameraSystem({ container });
  });

  afterEach(() => {
    cameraSystem.dispose();
    document.body.removeChild(container);
  });

  it('should create camera with correct settings', () => {
    const camera = cameraSystem.getCamera();
    expect(camera).toBeDefined();
    expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
    expect(camera.fov).toBe(60);
  });

  it('should initialize in follow mode', () => {
    expect(cameraSystem.getMode()).toBe('follow');
  });

  it('should toggle camera mode', () => {
    expect(cameraSystem.getMode()).toBe('follow');
    
    const newMode = cameraSystem.toggleMode();
    expect(newMode).toBe('free');
    expect(cameraSystem.getMode()).toBe('free');
    
    cameraSystem.toggleMode();
    expect(cameraSystem.getMode()).toBe('follow');
  });

  it('should set camera mode', () => {
    cameraSystem.setMode('free');
    expect(cameraSystem.getMode()).toBe('free');
    
    cameraSystem.setMode('follow');
    expect(cameraSystem.getMode()).toBe('follow');
  });

  it('should update camera position in follow mode', () => {
    const targetPosition = new THREE.Vector3(10, 0, 10);
    const initialPos = cameraSystem.getCamera().position.clone();
    
    cameraSystem.update(targetPosition);
    
    const newPos = cameraSystem.getCamera().position;
    expect(newPos.x).not.toBe(initialPos.x);
  });

  it('should update camera position in free mode', () => {
    cameraSystem.setMode('free');
    
    const targetPosition = new THREE.Vector3(5, 0, 5);
    const initialPos = cameraSystem.getCamera().position.clone();
    
    cameraSystem.update(targetPosition);
    
    const newPos = cameraSystem.getCamera().position;
    expect(newPos).toBeDefined();
  });

  it('should handle resize', () => {
    const camera = cameraSystem.getCamera();
    const initialAspect = camera.aspect;
    
    cameraSystem.handleResize(1920, 1080);
    
    expect(camera.aspect).not.toBe(initialAspect);
    expect(camera.aspect).toBe(1920 / 1080);
  });
});
