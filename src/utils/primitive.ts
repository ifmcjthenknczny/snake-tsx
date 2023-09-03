export const safeDivide = (
  dividend: number,
  divisor: number,
  returnZero?: true
) => {
  if (divisor === 0) {
    return returnZero ? 0 : null;
  }
  return dividend / divisor;
};

export const roundNumber = (number: number, decimalPlaces: number = 0) => {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(number * multiplier) / multiplier;
};

export const calculateValueProportionally = ({
  referenceValue,
  newRange,
  referenceRange,
  inverselyProportional,
}: {
  referenceValue: number;
  newRange: { min: number; max: number };
  referenceRange: { min: number; max: number };
  inverselyProportional?: true;
}) =>
  newRange.min +
  ((newRange.max - newRange.min) *
    (inverselyProportional
      ? referenceRange.max - referenceValue
      : referenceValue - referenceRange.min)) /
    (referenceRange.max - referenceRange.min);