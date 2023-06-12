import { GAME_OVER_REASONS, OPTIONS } from "./consts";

export type CellColor = "green" | "red" | "blue" | "darkgray" | "black";

export type Coords = {
  x: number;
  y: number;
};

export type Element = "apple" | "empty" | "head" | "tail" | "mine";

export type Key = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

export type OptionName = (typeof OPTIONS)[number];

export type OptionProp = {
  min: number | boolean;
  max: number | boolean;
  defaultValue: number | boolean;
  step?: number;
  realMin?: number;
  realMax?: number;
  label: string;
  inverselyProportional?: true;
  isBoolean?: true;
  dependsOn?: OptionName[];
  isDecimal?: true;
};
export type OptionsWithValue = Record<OptionName, OptionProp["defaultValue"]>;

export type GameState = "menu" | "settings" | "gameOver" | "playing";

export type GameOverReason = (typeof GAME_OVER_REASONS)[number];
