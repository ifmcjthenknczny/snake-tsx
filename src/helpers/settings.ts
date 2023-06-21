import { SETTINGS_PROPERTIES, SettingName } from "../constants/settings";

export const calculateRealSettingValue = (
  option: SettingName,
  value: number | boolean
) => {
  const { min, max, realMin, realMax, inverselyProportional } =
    SETTINGS_PROPERTIES[option];

  if (
    typeof value === "boolean" ||
    typeof min === "boolean" ||
    typeof max === "boolean"
  ) {
    return value;
  }

  if (realMin && realMax && !inverselyProportional) {
    return realMin + ((realMax - realMin) * (value - min)) / (max - min);
  }

  if (realMin && realMax && inverselyProportional) {
    return realMin + ((realMax - realMin) * (max - value)) / (max - min);
  }

  if (inverselyProportional) {
    return max - (max - min) * (min - value / max);
  }
  return value;
};
