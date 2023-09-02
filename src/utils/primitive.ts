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

export const calculateValueProportionally = (
  referenceValue: number,
  newMin: number,
  newMax: number,
  referenceMin: number,
  referenceMax: number,
  inverselyProportional?: true) =>
  newMin +
  ((newMax - newMin) *
    (inverselyProportional
      ? referenceMax - referenceValue
      : referenceValue - referenceMin)) /
    (referenceMax - referenceMin);