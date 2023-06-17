export const rangeExclude = (
  start: number,
  end: number,
  exclusionArray: number[]
) =>
  [...Array(end - start)]
    .map((_, i) =>
      !exclusionArray.includes(i + start) ? i + start : null
    )
    .filter((i) => i !== null);

export const rangeWithModulo = (start: number, end: number, modulo: number) => {
  if (end < start) {
    const length = modulo - start + 1 + end;
    return [...Array(length)].map((_, i) => (i + start) % modulo);
  }
  return [...Array(end - start)].map((_, i) => i + start);
};
