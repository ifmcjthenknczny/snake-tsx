import { BOARD_SIZE } from "./board";
import { Key } from "./keys";

export type GameState = "menu" | "settings" | "gameOver" | "playing" | "help";

export type GameOverReason = (typeof GAME_OVER_REASONS)[number];

export const STARTING_DIRECTION: Key = "ArrowLeft";

export const STARTING_HEAD_POSITION = {
  x: Math.floor(BOARD_SIZE.x / 2),
  y: Math.floor(BOARD_SIZE.y / 2),
};

export const NEW_MINE_DISTANCE_FROM_HEAD: number = 3;

export const OPPOSITE_DIRECTIONS: Record<Key, Key> = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
};

export const GAME_OVER_REASONS = ["wall", "tail", "mine"] as const;

