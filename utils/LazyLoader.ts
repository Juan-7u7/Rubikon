// utils/LazyLoader.ts
// Sistema de carga diferida (lazy loading) para componentes y recursos

import { logger } from './logger';

/**
 * Opciones de carga diferida
 */
export interface LazyLoadOptions {
  timeout?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

/**
 * Sistema de carga diferida
 */
export class LazyLoader {
  private static loadedModules: Map<string, any> = new Map();
  private static loadingPromises: Map<string, Promise<any>> = new Map();

  /**
   * Carga un módulo de forma diferida
   */
  static async loadModule<T = any>(
    modulePath: string,
    options: LazyLoadOptions = {}
  ): Promise<T> {
    const { timeout = 30000, retries = 3 } = options;

    // Si ya está cargado, retornar del caché
    if (this.loadedModules.has(modulePath)) {
      logger.debug(`Module loaded from cache: ${modulePath}`);
      return this.loadedModules.get(modulePath);
    }

    // Si ya se está cargando, esperar la promesa existente
    if (this.loadingPromises.has(modulePath)) {
      logger.debug(`Waiting for module to load: ${modulePath}`);
      return this.loadingPromises.get(modulePath)!;
    }

    // Crear nueva promesa de carga
    const loadPromise = this.loadWithRetry<T>(modulePath, retries, timeout, options);
    this.loadingPromises.set(modulePath, loadPromise);

    try {
      const module = await loadPromise;
      this.loadedModules.set(modulePath, module);
      this.loadingPromises.delete(modulePath);
      logger.info(`Module loaded successfully: ${modulePath}`);
      return module;
    } catch (error) {
      this.loadingPromises.delete(modulePath);
      logger.error(`Failed to load module: ${modulePath}`, error);
      if (options.onError) {
        options.onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Carga con reintentos
   */
  private static async loadWithRetry<T>(
    modulePath: string,
    retries: number,
    timeout: number,
    options: LazyLoadOptions
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        logger.debug(`Loading module (attempt ${attempt + 1}/${retries + 1}): ${modulePath}`);
        
        const module = await Promise.race([
          import(/* webpackChunkName: "[request]" */ modulePath),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Load timeout')), timeout)
          ),
        ]);

        return module as T;
      } catch (error) {
        lastError = error as Error;
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          logger.warn(`Retry loading ${modulePath} in ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error(`Failed to load ${modulePath}`);
  }

  /**
   * Precarga múltiples módulos
   */
  static async preloadModules(
    modulePaths: string[],
    options: LazyLoadOptions = {}
  ): Promise<void> {
    logger.info(`Preloading ${modulePaths.length} modules`);
    
    const total = modulePaths.length;
    let loaded = 0;

    const promises = modulePaths.map(async (path) => {
      try {
        await this.loadModule(path, options);
        loaded++;
        if (options.onProgress) {
          options.onProgress((loaded / total) * 100);
        }
      } catch (error) {
        logger.error(`Failed to preload: ${path}`, error);
      }
    });

    await Promise.allSettled(promises);
    logger.info(`Preloading complete: ${loaded}/${total} modules loaded`);
  }

  /**
   * Limpia el caché de módulos
   */
  static clearCache(modulePath?: string): void {
    if (modulePath) {
      this.loadedModules.delete(modulePath);
      logger.debug(`Cache cleared for: ${modulePath}`);
    } else {
      this.loadedModules.clear();
      logger.debug('All cache cleared');
    }
  }

  /**
   * Obtiene estadísticas de carga
   */
  static getStats(): {
    cachedModules: number;
    loadingModules: number;
    moduleList: string[];
  } {
    return {
      cachedModules: this.loadedModules.size,
      loadingModules: this.loadingPromises.size,
      moduleList: Array.from(this.loadedModules.keys()),
    };
  }
}

/**
 * Helper para crear componentes lazy de React
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const React = require('react');
  
  return React.lazy(factory);
}

/**
 * Carga diferida de assets 3D
 */
export class AssetLoader {
  private static loadedAssets: Map<string, any> = new Map();

  /**
   * Carga un asset 3D
   */
  static async loadAsset(
    url: string,
    loader: any,
    options: LazyLoadOptions = {}
  ): Promise<any> {
    if (this.loadedAssets.has(url)) {
      logger.debug(`Asset loaded from cache: ${url}`);
      return this.loadedAssets.get(url);
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Asset load timeout: ${url}`));
      }, options.timeout || 30000);

      loader.load(
        url,
        (asset: any) => {
          clearTimeout(timer);
          this.loadedAssets.set(url, asset);
          logger.info(`Asset loaded: ${url}`);
          resolve(asset);
        },
        (progress: ProgressEvent) => {
          if (options.onProgress && progress.total > 0) {
            const percent = (progress.loaded / progress.total) * 100;
            options.onProgress(percent);
          }
        },
        (error: Error) => {
          clearTimeout(timer);
          logger.error(`Asset load error: ${url}`, error);
          if (options.onError) {
            options.onError(error);
          }
          reject(error);
        }
      );
    });
  }

  /**
   * Limpia assets del caché
   */
  static clearAssets(url?: string): void {
    if (url) {
      const asset = this.loadedAssets.get(url);
      if (asset && asset.dispose) {
        asset.dispose();
      }
      this.loadedAssets.delete(url);
    } else {
      this.loadedAssets.forEach((asset) => {
        if (asset && asset.dispose) {
          asset.dispose();
        }
      });
      this.loadedAssets.clear();
    }
  }
}

export default LazyLoader;
