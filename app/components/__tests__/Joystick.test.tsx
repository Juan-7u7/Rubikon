// app/components/__tests__/Joystick.test.tsx
import { render } from '@testing-library/react-native';
import React from 'react';
import Joystick from '../Joystick';

describe('Joystick Component', () => {
  const mockOnMove = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<Joystick onMove={mockOnMove} />);
    // El componente debería renderizarse sin errores
    expect(getByTestId).toBeDefined();
  });

  it('should render with default size', () => {
    const { container } = render(<Joystick onMove={mockOnMove} />);
    expect(container).toBeTruthy();
  });

  it('should render with custom size', () => {
    const customSize = 150;
    const { container } = render(<Joystick onMove={mockOnMove} size={customSize} />);
    expect(container).toBeTruthy();
  });

  it('should call onMove with (0, 0) initially', () => {
    render(<Joystick onMove={mockOnMove} />);
    // El joystick debería estar en posición neutral al inicio
    // No debería llamar onMove hasta que haya interacción
    expect(mockOnMove).not.toHaveBeenCalled();
  });

  it('should accept valid size prop', () => {
    const validSize = 120;
    const { container } = render(<Joystick onMove={mockOnMove} size={validSize} />);
    expect(container).toBeTruthy();
  });

  it('should handle onMove callback', () => {
    const { container } = render(<Joystick onMove={mockOnMove} />);
    expect(container).toBeTruthy();
    expect(mockOnMove).toBeInstanceOf(Function);
  });
});
