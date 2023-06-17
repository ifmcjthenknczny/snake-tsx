import { GAME_OVER_REASONS } from "../constants/rules";
import { SETTINGS } from "../constants/settings";

export type CellColor = "green" | "red" | "blue" | "darkgray" | "black";

export type Coords = {
  x: number;
  y: number;
};

export type Element = "apple" | "empty" | "head" | "tail" | "mine";

export type Key = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

export type SettingName = (typeof SETTINGS)[number];

export type SettingProperties = {
  min: number | boolean;
  max: number | boolean;
  defaultValue: number | boolean;
  step?: number;
  realMin?: number;
  realMax?: number;
  label: string;
  inverselyProportional?: true;
  isBoolean?: true;
  dependsOn?: SettingName[];
  isDecimal?: true;
};
export type SettingsWithValue = Record<
  SettingName,
  SettingProperties["defaultValue"]
>;

export type GameState = "menu" | "settings" | "gameOver" | "playing";

export type GameOverReason = (typeof GAME_OVER_REASONS)[number];

export type MenuOption = "NEW GAME" | "SETTINGS";
