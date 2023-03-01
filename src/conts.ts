import { Key, ElementColors, Ms } from "./types";

export const BOARD_SIZE = {
  x: 20,
  y: 20,
}; // not implemented different sizes than 20x20 yet, CSS thing

export const ELEMENTS_COLORS: ElementColors = {
  apple: "green",
  empty: "darkgray",
  head: "red",
  tail: "blue",
  mine: "black",
};

export const STARTING_MOVE_REFRESH: Ms = 600;

export const SNAKE_SPEED_MULTIPLIER = 1.25;

export const APPLES_TO_SPEED_UP = 5;

export const APPLE_CHANGE_POSITION_INTERVAL: Ms = 10000; // not implemented

export const NEW_MINE_INTERVAL: Ms = 30000;

export const LOCAL_STORAGE_HIGH_SCORE_NAME = "HighScore";

export const FORBIDDEN_DIRECTIONS: Record<Key, Key> = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
};

export const STARTING_DIRECTION: Key = "ArrowLeft";

export const STARTING_HEAD_POSITION = {
  x: Math.floor(BOARD_SIZE.x / 2),
  y: Math.floor(BOARD_SIZE.y / 2),
};

export const STARTING_LENGTH: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 3;

export const STARTING_MINE = false;

export const ACCEPTED_KEYS: Key[] = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];

export const WALLS: true = true; // not implemented "false"
