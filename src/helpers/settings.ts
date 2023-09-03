import { SETTINGS_PROPERTIES, SettingName } from "../constants/settings";
import { SettingValue } from "../constants/settings";
import { calculateValueProportionally } from "./../utils/primitive";

export const calculateRealSettingValue = (
  option: SettingName,
  value: SettingValue
) => calculateSettingValue(option, value, 'toReal')

export const calculateRelativeSettingValue = (
  option: SettingName,
  realValue: SettingValue
) => calculateSettingValue(option, realValue, 'toRelative')

const calculateSettingValue = (
  option: SettingName,
  value: SettingValue,
  calculationType: "toReal" | "toRelative"
) => {
  const { min, max, realMin, realMax, inverselyProportional } =
    SETTINGS_PROPERTIES[option];

  if (
    typeof value === "boolean" ||
    typeof realMin === "boolean" ||
    typeof realMax === "boolean" ||
    typeof min === "boolean" ||
    typeof max === "boolean"
  ) {
    return value as boolean;
  }

  if (!realMin || !realMax) {
    return value;
  }

  const payload = {
    referenceValue: value,
    newRange: calculationType === 'toRelative' ? { min, max } : { min: realMin, max: realMax },
    referenceRange: calculationType === 'toReal' ? { min, max } : { min: realMin, max: realMax },
    inverselyProportional
  }

  return calculateValueProportionally(payload)
};
