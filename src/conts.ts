import { Key, Element, CellColor } from "./types";

// BOARD
export const BOARD_SIZE = {
  x: 20,
  y: 20,
}; // not implemented different sizes than 20x20 yet, CSS thing
export const ELEMENTS_COLORS: Record<Element, CellColor> = {
  apple: "green",
  empty: "darkgray",
  head: "red",
  tail: "blue",
  mine: "black",
};

// SNAKE SPEED
export const STARTING_MOVE_REFRESH_MS = 500;
export const SNAKE_SPEED_MULTIPLIER = 1.1;
export const APPLES_TO_SPEED_UP_SNAKE = 1;

// APPLE CHANGE POSITION SPEED
export const APPLE_CHANGE_POSITION_INTERVAL_MS = 10000; // not implemented
export const APPLE_CHANGE_POSITION_INTERVAL_MULTIPLIER = 1;
export const APPLES_TO_SPEED_UP_APPLE_CHANGE_POSITION = 1;

// MINES
export const NEW_MINE_INTERVAL_MS = 30000;
export const STARTING_MINE: boolean = false;
export const LOCAL_STORAGE_HIGH_SCORE_NAME: string = "HighScore";

// CONTROLS
export const CONTROL_KEYS: Key[] = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];
export const PAUSE_KEY = "Space";

// STARTING SNAKE MOVE PARAMS
export const STARTING_DIRECTION: Key = "ArrowLeft";
export const STARTING_HEAD_POSITION = {
  x: Math.floor(BOARD_SIZE.x / 2),
  y: Math.floor(BOARD_SIZE.y / 2),
};
export const STARTING_LENGTH: number = 20;

// GAME RULES
export const WALLS: boolean = false;
export const NEW_MINE_DISTANCE_FROM_HEAD: number = 3; // not implemented

// DIRECTIONS
export const OPPOSITE_DIRECTIONS: Record<Key, Key> = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
};