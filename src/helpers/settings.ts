import { SETTINGS_PROPERTIES, SettingName } from "../constants/settings";
import { SettingValue } from "../constants/settings";
import { calculateValueProportionally } from "./../utils/primitive";

export const calculateRealSettingValue = (
  settingName: SettingName,
  value: SettingValue
) => calculateSettingValue(settingName, value, 'toReal')

export const calculateRelativeSettingValue = (
  settingName: SettingName,
  realValue: SettingValue
) => calculateSettingValue(settingName, realValue, 'toRelative')

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

export const toValueLabel = (value: number | boolean, settingName: SettingName, isDecimal?: true) => {
  if (settingName === 'SNAKE_SPEED_MULTIPLIER' && value === 1) {
      return 'OFF'
  }
  if (settingName === 'APPLES_TO_SPEED_UP_SNAKE' && value === 1) {
      return 'EVERY'
  }
  if (typeof value === 'boolean') {
      return !!value ? 'ON' : 'OFF'
  }
  if (isDecimal) {
      return `${value.toFixed(2)}`
  }
  return `${value}`
}