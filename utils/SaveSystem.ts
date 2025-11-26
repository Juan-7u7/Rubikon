// utils/SaveSystem.ts
// Sistema de guardado y carga de partidas

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

/**
 * Datos de una partida guardada
 */
export interface SaveData {
  version: string;
  timestamp: number;
  playerData: {
    position: { x: number; y: number; z: number };
    health: number;
    score: number;
    level: number;
  };
  gameData: {
    playTime: number;
    achievements: string[];
    settings: Record<string, any>;
  };
}

/**
 * Sistema de guardado de partidas
 */
export class SaveSystem {
  private static readonly SAVE_KEY = 'rubikon_save_';
  private static readonly VERSION = '1.0.0';
  private static readonly MAX_SAVES = 3;

  /**
   * Guarda una partida
   */
  static async save(slotId: number, data: Partial<SaveData>): Promise<boolean> {
    try {
      const saveData: SaveData = {
        version: this.VERSION,
        timestamp: Date.now(),
        playerData: data.playerData || {
          position: { x: 0, y: 0, z: 0 },
          health: 100,
          score: 0,
          level: 1,
        },
        gameData: data.gameData || {
          playTime: 0,
          achievements: [],
          settings: {},
        },
      };

      const key = `${this.SAVE_KEY}${slotId}`;
      await AsyncStorage.setItem(key, JSON.stringify(saveData));
      
      logger.info(`Game saved to slot ${slotId}`);
      return true;
    } catch (error) {
      logger.error('Error saving game', error);
      return false;
    }
  }

  /**
   * Carga una partida
   */
  static async load(slotId: number): Promise<SaveData | null> {
    try {
      const key = `${this.SAVE_KEY}${slotId}`;
      const data = await AsyncStorage.getItem(key);

      if (!data) {
        logger.warn(`No save found in slot ${slotId}`);
        return null;
      }

      const saveData: SaveData = JSON.parse(data);

      // Verificar versión
      if (saveData.version !== this.VERSION) {
        logger.warn(`Save version mismatch: ${saveData.version} vs ${this.VERSION}`);
        // Aquí podrías implementar migración de versiones
      }

      logger.info(`Game loaded from slot ${slotId}`);
      return saveData;
    } catch (error) {
      logger.error('Error loading game', error);
      return null;
    }
  }

  /**
   * Elimina una partida
   */
  static async deleteSave(slotId: number): Promise<boolean> {
    try {
      const key = `${this.SAVE_KEY}${slotId}`;
      await AsyncStorage.removeItem(key);
      
      logger.info(`Save deleted from slot ${slotId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting save', error);
      return false;
    }
  }

  /**
   * Obtiene información de todas las partidas guardadas
   */
  static async getAllSaves(): Promise<Array<{ slotId: number; data: SaveData | null }>> {
    const saves: Array<{ slotId: number; data: SaveData | null }> = [];

    for (let i = 0; i < this.MAX_SAVES; i++) {
      const data = await this.load(i);
      saves.push({ slotId: i, data });
    }

    return saves;
  }

  /**
   * Verifica si existe una partida en un slot
   */
  static async hasSave(slotId: number): Promise<boolean> {
    try {
      const key = `${this.SAVE_KEY}${slotId}`;
      const data = await AsyncStorage.getItem(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Guarda configuración del juego
   */
  static async saveSettings(settings: Record<string, any>): Promise<boolean> {
    try {
      await AsyncStorage.setItem('rubikon_settings', JSON.stringify(settings));
      logger.info('Settings saved');
      return true;
    } catch (error) {
      logger.error('Error saving settings', error);
      return false;
    }
  }

  /**
   * Carga configuración del juego
   */
  static async loadSettings(): Promise<Record<string, any> | null> {
    try {
      const data = await AsyncStorage.getItem('rubikon_settings');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Error loading settings', error);
      return null;
    }
  }

  /**
   * Exporta una partida como JSON
   */
  static async exportSave(slotId: number): Promise<string | null> {
    const data = await this.load(slotId);
    return data ? JSON.stringify(data, null, 2) : null;
  }

  /**
   * Importa una partida desde JSON
   */
  static async importSave(slotId: number, jsonData: string): Promise<boolean> {
    try {
      const data: SaveData = JSON.parse(jsonData);
      return await this.save(slotId, data);
    } catch (error) {
      logger.error('Error importing save', error);
      return false;
    }
  }

  /**
   * Limpia todas las partidas guardadas
   */
  static async clearAllSaves(): Promise<boolean> {
    try {
      for (let i = 0; i < this.MAX_SAVES; i++) {
        await this.deleteSave(i);
      }
      logger.info('All saves cleared');
      return true;
    } catch (error) {
      logger.error('Error clearing saves', error);
      return false;
    }
  }
}

export default SaveSystem;
