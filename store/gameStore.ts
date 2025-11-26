// store/gameStore.ts
// Estado global del juego usando Zustand

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Estado del jugador
 */
interface PlayerState {
  position: { x: number; y: number; z: number };
  health: number;
  score: number;
  level: number;
}

/**
 * Estado de la cámara
 */
interface CameraState {
  mode: 'follow' | 'free';
  position: { x: number; y: number; z: number };
}

/**
 * Estado del juego
 */
interface GameState {
  // Estado
  isPlaying: boolean;
  isPaused: boolean;
  player: PlayerState;
  camera: CameraState;
  
  // Acciones
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  
  // Jugador
  updatePlayerPosition: (x: number, y: number, z: number) => void;
  updatePlayerHealth: (health: number) => void;
  addScore: (points: number) => void;
  levelUp: () => void;
  
  // Cámara
  setCameraMode: (mode: 'follow' | 'free') => void;
  updateCameraPosition: (x: number, y: number, z: number) => void;
  
  // Utilidades
  reset: () => void;
}

const initialState = {
  isPlaying: false,
  isPaused: false,
  player: {
    position: { x: 0, y: 0, z: 0 },
    health: 100,
    score: 0,
    level: 1,
  },
  camera: {
    mode: 'follow' as const,
    position: { x: 0, y: 6, z: 10 },
  },
};

/**
 * Store global del juego
 */
export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,

      // Acciones del juego
      startGame: () => set({ isPlaying: true, isPaused: false }),
      
      pauseGame: () => set({ isPaused: true }),
      
      resumeGame: () => set({ isPaused: false }),
      
      endGame: () => set({ isPlaying: false, isPaused: false }),

      // Acciones del jugador
      updatePlayerPosition: (x, y, z) =>
        set((state) => ({
          player: { ...state.player, position: { x, y, z } },
        })),

      updatePlayerHealth: (health) =>
        set((state) => ({
          player: { ...state.player, health: Math.max(0, Math.min(100, health)) },
        })),

      addScore: (points) =>
        set((state) => ({
          player: { ...state.player, score: state.player.score + points },
        })),

      levelUp: () =>
        set((state) => ({
          player: { ...state.player, level: state.player.level + 1 },
        })),

      // Acciones de cámara
      setCameraMode: (mode) =>
        set((state) => ({
          camera: { ...state.camera, mode },
        })),

      updateCameraPosition: (x, y, z) =>
        set((state) => ({
          camera: { ...state.camera, position: { x, y, z } },
        })),

      // Resetear
      reset: () => set(initialState),
    }),
    {
      name: 'rubikon-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir ciertos campos
      partialize: (state) => ({
        player: {
          score: state.player.score,
          level: state.player.level,
        },
      }),
    }
  )
);

/**
 * Selectores útiles
 */
export const selectPlayer = (state: GameState) => state.player;
export const selectCamera = (state: GameState) => state.camera;
export const selectIsPlaying = (state: GameState) => state.isPlaying;
export const selectIsPaused = (state: GameState) => state.isPaused;

export default useGameStore;
