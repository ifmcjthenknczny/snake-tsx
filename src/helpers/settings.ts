import { SETTINGS_PROPERTIES, SettingName } from "../constants/settings";
import { SettingValue } from "../constants/settings";
import { calculateValueProportionally } from "./../utils/primitive";

export const calculateRealSettingValue = (
  option: SettingName,
  value: SettingValue
) => {
  const { min, max, realMin, realMax, inverselyProportional } =
    SETTINGS_PROPERTIES[option];

  if (
    typeof value === "boolean" ||
    typeof min === "boolean" ||
    typeof realMin === "boolean" ||
    typeof realMax === "boolean" ||
    typeof max === "boolean"
  ) {
    return value as Boolean;
  }

  if (!realMin || !realMax) {
    return value
  }

  return calculateValueProportionally(
    value,
    realMin,
    realMax,
    min,
    max,
    inverselyProportional
  );
};

export const calculateRelativeSettingValue = (
  option: SettingName,
  realValue: SettingValue
) => {
  const { min, max, realMin, realMax, inverselyProportional } =
    SETTINGS_PROPERTIES[option];

  if (
    typeof realValue === "boolean" ||
    typeof realMin === "boolean" ||
    typeof realMax === "boolean" ||
    typeof min === "boolean" ||
    typeof max === "boolean"
  ) {
    return;
  }

  if (!realMin || !realMax) {
    return realValue
  }

  return calculateValueProportionally(
      realValue,
      min,
      max,
      realMin,
      realMax,
      inverselyProportional
    );
};
