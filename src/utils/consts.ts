import {
  Key,
  Element,
  CellColor,
  OptionProp,
  OptionName,
  OptionsWithValue,
} from "./types";

// BOARD
export const BOARD_SIZE = {
  x: 20,
  y: 20,
}; // not implemented different sizes than 20x20 yet, CSS thing
export const CELLS_COUNT = BOARD_SIZE.x * BOARD_SIZE.y;
export const ELEMENTS_COLORS: Record<Element, CellColor> = {
  apple: "green",
  empty: "darkgray",
  head: "red",
  tail: "blue",
  mine: "black",
};

// MINES
export const STARTING_MINE: boolean = false;

// STORAGE
export const LOCAL_STORAGE_HIGH_SCORE_NAME: string = "HighScore";

// CONTROLS
export const CONTROL_KEYS: Key[] = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];
export const PAUSE_KEY = "Space"; // not implemented
export const MENU_KEY = "Escape";

// STARTING SNAKE MOVE PARAMS
export const STARTING_DIRECTION: Key = "ArrowLeft";
export const STARTING_HEAD_POSITION = {
  x: Math.floor(BOARD_SIZE.x / 2),
  y: Math.floor(BOARD_SIZE.y / 2),
};
export const STARTING_LENGTH: number = 3;

// GAME RULES
export const NEW_MINE_DISTANCE_FROM_HEAD: number = 3;

// DIRECTIONS
export const OPPOSITE_DIRECTIONS: Record<Key, Key> = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
};

// CONFIGURABLE OPTIONS
export const OPTIONS = [
  "STARTING_MOVE_REFRESH_MS",
  "STARTING_LENGTH",
  "SNAKE_SPEED_MULTIPLIER",
  "APPLES_TO_SPEED_UP_SNAKE",
  "WALLS",
  "NEW_MINE_INTERVAL_MS",
  "APPLE_CHANGES_POSITION",
  "APPLE_CHANGE_POSITION_INTERVAL_MS",
  "APPLE_CHANGE_POSITION_INTERVAL_WITH_SNAKE",
] as const;

export const OPTIONS_PROPERTIES: Record<OptionName, OptionProp> = {
  STARTING_MOVE_REFRESH_MS: {
    min: 1,
    max: 10,
    defaultValue: 5,
    step: 1,
    realMin: 100,
    realMax: 1000,
    label: "SNAKE SPEED",
    inverselyProportional: true,
  },
  SNAKE_SPEED_MULTIPLIER: {
    min: 1,
    max: 2,
    step: 0.05,
    defaultValue: 1.25,
    label: "SPEED MULTIPLIER",
    isDecimal: true,
  },
  APPLES_TO_SPEED_UP_SNAKE: {
    min: 1,
    max: 10,
    defaultValue: 5,
    step: 1,
    label: "APPLES TO SPEED UP",
  },
  APPLE_CHANGE_POSITION_INTERVAL_MS: {
    min: 1,
    max: 20,
    defaultValue: 5,
    step: 1,
    realMin: 5000,
    realMax: 50000,
    label: "INTERVAL",
    inverselyProportional: true,
    dependsOn: ["APPLE_CHANGES_POSITION"],
  },
  APPLE_CHANGE_POSITION_INTERVAL_WITH_SNAKE: {
    min: false,
    max: true,
    defaultValue: true,
    step: 1,
    label: "SPEEDS UP",
    isBoolean: true,
    dependsOn: ["APPLE_CHANGES_POSITION"],
  },
  APPLE_CHANGES_POSITION: {
    min: false,
    max: true,
    defaultValue: true,
    step: 1,
    label: "APPLE CHANGES POSITION",
    isBoolean: true,
  },
  NEW_MINE_INTERVAL_MS: {
    min: 1,
    max: 20,
    defaultValue: 10,
    step: 1,
    realMin: 5000,
    realMax: 50000,
    label: "NEW MINE INTERVAL",
    inverselyProportional: true,
  },
  WALLS: {
    min: false,
    max: true,
    defaultValue: false,
    step: 1,
    label: "WALLS",
    isBoolean: true,
  },
  STARTING_LENGTH: {
    min: 2,
    max: 20,
    defaultValue: 3,
    step: 1,
    label: "STARTING LENGTH",
  },
};

export const SETTINGS_DEFAULTS = Object.keys(OPTIONS_PROPERTIES).reduce(
  (acc, option) => ({
    ...acc,
    [option]: OPTIONS_PROPERTIES[option].defaultValue,
  }),
  {} as OptionsWithValue
);

export const GAME_OVER_REASONS = ["wall", "tail", "mine"] as const;
