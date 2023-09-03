import { calculateRealSettingValue } from "../helpers/settings";

export type SettingName = (typeof SETTINGS)[number];

export type SettingValue = number | boolean;

export type SettingProperties = {
  min: SettingValue;
  max: SettingValue;
  defaultValue: SettingValue;
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
  SettingValuesSet
>;

type SettingValuesSet = { relative: SettingValue; real: SettingValue }

export const SETTINGS = [
  "WALLS",
  "STARTING_MOVE_REFRESH_MS",
  "STARTING_LENGTH",
  "SNAKE_SPEED_MULTIPLIER",
  "APPLES_TO_SPEED_UP_SNAKE",
  "NEW_MINE_INTERVAL_MS",
  "BOARD_WIDTH",
  "BOARD_HEIGHT"
] as const;

export const SETTINGS_PROPERTIES: Record<SettingName, SettingProperties> = {
  STARTING_MOVE_REFRESH_MS: {
    min: 1,
    max: 10,
    defaultValue: 4,
    step: 1,
    realMin: 100,
    realMax: 800,
    label: "INITIAL SNAKE SPEED",
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
  NEW_MINE_INTERVAL_MS: {
    min: 1,
    max: 10,
    defaultValue: 1,
    step: 1,
    realMin: 1000,
    realMax: 30000,
    label: "MINE DEPLOYMENT SPEED",
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
    max: 10,
    defaultValue: 3,
    step: 1,
    label: "STARTING LENGTH",
  },
  BOARD_WIDTH: {
    min: 10,
    max: 40,
    defaultValue: 20,
    step: 1,
    label: "BOARD WIDTH",
  },
  BOARD_HEIGHT: {
    min: 10,
    max: 40,
    defaultValue: 20,
    step: 1,
    label: "BOARD HEIGHT",
  },
};

export const SETTINGS_DEFAULTS = Object.keys(SETTINGS_PROPERTIES).reduce(
  (acc, settingName) => ({
    ...acc,
    [settingName]: {
      relative: SETTINGS_PROPERTIES[settingName].defaultValue,
      real: calculateRealSettingValue(settingName as SettingName, SETTINGS_PROPERTIES[settingName].defaultValue)
    }
  }),
  {} as SettingsWithValue
);