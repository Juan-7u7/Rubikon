// hooks/__tests__/useGameControls.test.ts
import { act, renderHook } from '@testing-library/react-native';
import { useGameControls } from '../useGameControls';

// Mock de window para simular entorno web
global.window = {
  ...global.window,
  innerWidth: 1920,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

global.navigator = {
  ...global.navigator,
  maxTouchPoints: 0,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
};

describe('useGameControls Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGameControls());

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
    expect(result.current.isMobile).toBe(false);
  });

  it('should detect desktop device', () => {
    const { result } = renderHook(() => useGameControls());
    expect(result.current.isMobile).toBe(false);
  });

  it('should handle joystick move', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      result.current.handleJoystickMove(0.5, 0.8);
    });

    expect(result.current.x).toBe(0.5);
    expect(result.current.y).toBe(-0.8); // Y invertido
  });

  it('should reset controls', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      result.current.handleJoystickMove(0.5, 0.5);
    });

    expect(result.current.x).toBe(0.5);

    act(() => {
      result.current.reset();
    });

    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('should respect enableKeyboard config', () => {
    const { result } = renderHook(() =>
      useGameControls({ enableKeyboard: false })
    );

    expect(result.current).toBeDefined();
  });

  it('should respect enableTouch config', () => {
    const { result } = renderHook(() =>
      useGameControls({ enableTouch: false })
    );

    act(() => {
      result.current.handleJoystickMove(1, 1);
    });

    // No debería actualizar si touch está deshabilitado
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('should invert Y axis for joystick', () => {
    const { result } = renderHook(() => useGameControls());

    act(() => {
      result.current.handleJoystickMove(0, 1);
    });

    expect(result.current.y).toBe(-1);
  });
});
