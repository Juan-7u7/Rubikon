// utils/PlatformAdapter.ts
// Adaptador para diferencias entre plataformas (Web/Native)

import { Platform } from 'react-native';

export type PlatformType = 'web' | 'ios' | 'android' | 'native';

/**
 * Información de la plataforma actual
 */
export interface PlatformInfo {
  type: PlatformType;
  isWeb: boolean;
  isNative: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
}

/**
 * Adaptador para manejar diferencias entre plataformas
 */
export class PlatformAdapter {
  private static instance: PlatformAdapter;
  private info: PlatformInfo;

  private constructor() {
    this.info = this.detectPlatform();
  }

  /**
   * Obtiene la instancia singleton
   */
  static getInstance(): PlatformAdapter {
    if (!PlatformAdapter.instance) {
      PlatformAdapter.instance = new PlatformAdapter();
    }
    return PlatformAdapter.instance;
  }

  /**
   * Detecta la plataforma actual
   */
  private detectPlatform(): PlatformInfo {
    const platformOS = Platform.OS;
    const isWeb = platformOS === 'web';
    const isNative = !isWeb;

    // Detectar si es móvil/tablet en web
    let isMobile = false;
    let isTablet = false;
    let hasTouch = false;
    let screenWidth = 0;
    let screenHeight = 0;
    let pixelRatio = 1;

    if (isWeb && typeof window !== 'undefined') {
      hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;
      pixelRatio = window.devicePixelRatio || 1;

      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileUA = mobileRegex.test(navigator.userAgent);
      const isSmallScreen = screenWidth <= 768;
      const isMediumScreen = screenWidth > 768 && screenWidth <= 1024;

      isMobile = (hasTouch && isSmallScreen) || (isMobileUA && !navigator.userAgent.includes('iPad'));
      isTablet = (hasTouch && isMediumScreen) || navigator.userAgent.includes('iPad');
    } else if (isNative) {
      // En native, usar Platform API
      isMobile = platformOS === 'ios' || platformOS === 'android';
      hasTouch = true;
      // En native, obtener dimensiones de otra forma si es necesario
    }

    const isDesktop = !isMobile && !isTablet;

    return {
      type: platformOS as PlatformType,
      isWeb,
      isNative,
      isMobile,
      isTablet,
      isDesktop,
      hasTouch,
      screenWidth,
      screenHeight,
      pixelRatio,
    };
  }

  /**
   * Obtiene información de la plataforma
   */
  getPlatformInfo(): PlatformInfo {
    return { ...this.info };
  }

  /**
   * Verifica si es web
   */
  isWeb(): boolean {
    return this.info.isWeb;
  }

  /**
   * Verifica si es native
   */
  isNative(): boolean {
    return this.info.isNative;
  }

  /**
   * Verifica si es móvil
   */
  isMobile(): boolean {
    return this.info.isMobile;
  }

  /**
   * Verifica si es tablet
   */
  isTablet(): boolean {
    return this.info.isTablet;
  }

  /**
   * Verifica si es desktop
   */
  isDesktop(): boolean {
    return this.info.isDesktop;
  }

  /**
   * Verifica si tiene capacidades táctiles
   */
  hasTouch(): boolean {
    return this.info.hasTouch;
  }

  /**
   * Ejecuta código específico de plataforma
   */
  select<T>(options: {
    web?: T;
    native?: T;
    ios?: T;
    android?: T;
    default?: T;
  }): T | undefined {
    if (this.info.type === 'web' && options.web !== undefined) {
      return options.web;
    }
    if (this.info.type === 'ios' && options.ios !== undefined) {
      return options.ios;
    }
    if (this.info.type === 'android' && options.android !== undefined) {
      return options.android;
    }
    if (this.info.isNative && options.native !== undefined) {
      return options.native;
    }
    return options.default;
  }

  /**
   * Obtiene el tamaño óptimo de joystick según la plataforma
   */
  getOptimalJoystickSize(): number {
    if (this.info.isMobile) {
      return 100;
    }
    if (this.info.isTablet) {
      return 120;
    }
    return 0; // No mostrar en desktop
  }

  /**
   * Obtiene la configuración óptima de renderer según la plataforma
   */
  getRendererConfig(): {
    antialias: boolean;
    pixelRatio: number;
    powerPreference: 'high-performance' | 'low-power' | 'default';
  } {
    if (this.info.isMobile) {
      return {
        antialias: false, // Mejor performance en móvil
        pixelRatio: Math.min(this.info.pixelRatio, 2),
        powerPreference: 'low-power',
      };
    }

    return {
      antialias: true,
      pixelRatio: Math.min(this.info.pixelRatio, 2),
      powerPreference: 'high-performance',
    };
  }

  /**
   * Obtiene el número máximo de luces según la plataforma
   */
  getMaxLights(): number {
    if (this.info.isMobile) {
      return 3; // Limitar luces en móvil
    }
    if (this.info.isTablet) {
      return 5;
    }
    return 8; // Desktop puede manejar más
  }

  /**
   * Verifica si debe usar sombras según la plataforma
   */
  shouldUseShadows(): boolean {
    return !this.info.isMobile; // Desactivar sombras en móvil para mejor performance
  }

  /**
   * Actualiza la información de la plataforma (llamar en resize)
   */
  refresh(): void {
    this.info = this.detectPlatform();
  }
}

// Exportar instancia singleton
export const platformAdapter = PlatformAdapter.getInstance();

export default platformAdapter;
