import { Coords, Key } from "./types";
import { BOARD_SIZE, OPPOSITE_DIRECTIONS, OPTIONS_PROPERTIES } from "./consts";
import { randInt, randomElement, isObjectEqual } from "./utils";
import { OptionName } from "./types";

export const randomCoords = () => ({
  x: randInt(0, BOARD_SIZE.x),
  y: randInt(0, BOARD_SIZE.y),
});

export const randomAvailableCoords = (occupiedCoords: Coords[]) => {
  const occupiedInts = occupiedCoords.map(coordsToInt);
  const availableInts = rangeExclude(
    0,
    BOARD_SIZE.x * BOARD_SIZE.y,
    occupiedInts
  );
  return intToCoords(randomElement(availableInts));
};

export const generateStartingSnakeTail = (
  startingLength: number,
  startingHeadPosition: Coords,
  startingDirection: Key
) => {
  const startingTailDirectionsOrder: Record<number, Key> = {
    1: "ArrowRight",
    2: "ArrowDown",
    3: "ArrowLeft",
    4: "ArrowUp",
  };
  const tailCoordsInt: number[] = [];
  let directionIndex = Object.values(startingTailDirectionsOrder).findIndex(
    (key) => key === OPPOSITE_DIRECTIONS[startingDirection]
  );
  while (tailCoordsInt.length < startingLength) {
    const direction: Key = startingTailDirectionsOrder[directionIndex];
    const proposedTailCoords = nextHeadPosition(
      !tailCoordsInt.length
        ? startingHeadPosition
        : intToCoords(tailCoordsInt.at(-1)),
      direction,
      true
    );
    if (
      isWithinGrid(proposedTailCoords) &&
      !tailCoordsInt.includes(coordsToInt(proposedTailCoords))
    ) {
      tailCoordsInt.push(coordsToInt(proposedTailCoords));
    } else {
      directionIndex =
        (directionIndex + 1) % Object.keys(startingTailDirectionsOrder).length;
    }
  }
  return tailCoordsInt.slice(1).map(intToCoords);
};

export const coordsToInt = (coords: Coords) =>
  BOARD_SIZE.y * coords.y + coords.x;

export const intToCoords = (int: number) => ({
  x: int % BOARD_SIZE.x,
  y: Math.floor(int / BOARD_SIZE.x),
});

export const toNumber = (value: number | boolean) => {
  if (typeof value === "boolean") {
    if (value) {
      return 1;
    }
    return 0;
  }
  return value;
};

export const isWithinGrid = (coords: Coords) =>
  coords.x >= 0 &&
  coords.y >= 0 &&
  coords.x < BOARD_SIZE.x &&
  coords.y < BOARD_SIZE.y;

export const rangeExclude = (
  start: number,
  end: number,
  exclusionArray: number[]
) =>
  [...Array(end - start)]
    .map((_, i) =>
      !exclusionArray.includes(i + start) ? i + start : undefined
    )
    .filter((i) => i !== undefined);

const rangeWithModulo = (start: number, end: number, modulo: number) => {
  if (end < start) {
    const length = modulo - start + 1 + end;
    return [...Array(length)].map((_, i) => (i + start) % modulo);
  }
  return [...Array(end - start)].map((_, i) => i + start);
};

export const isAboutToGoOutsideGrid = (key: Key, head: Coords) => {
  if (key === "ArrowLeft" && head.x === 0) return true;
  if (key === "ArrowRight" && head.x === BOARD_SIZE.x - 1) return true;
  if (key === "ArrowUp" && head.y === 0) return true;
  if (key === "ArrowDown" && head.y === BOARD_SIZE.y - 1) return true;
  return false;
};

export const nextHeadPosition = (
  headCoords: Coords,
  currentKey: Key,
  isWalls: boolean
) => {
  const skipToOtherSide =
    !isWalls && isAboutToGoOutsideGrid(currentKey, headCoords);

  const nextPositionForKeys = {
    ArrowUp: { y: skipToOtherSide ? BOARD_SIZE.y - 1 : headCoords.y - 1 },
    ArrowDown: { y: skipToOtherSide ? 0 : headCoords.y + 1 },
    ArrowLeft: { x: skipToOtherSide ? BOARD_SIZE.x - 1 : headCoords.x - 1 },
    ArrowRight: { x: skipToOtherSide ? 0 : headCoords.x + 1 },
  };
  return { ...headCoords, ...nextPositionForKeys[currentKey] };
};

export const isEatingApple = (headCoords: Coords, appleCoords: Coords) =>
  isObjectEqual(headCoords, appleCoords);

export const isGameOver = (
  headCoords: Coords,
  tailCoords: Coords[],
  mineCoords: Coords[],
  isWalls: boolean
) => {
  if (isWalls && !isWithinGrid(headCoords)) {
    return "wall";
  }
  for (let tail of tailCoords) {
    if (isObjectEqual(tail, headCoords)) {
      return "tail";
    }
  }
  for (let mine of mineCoords) {
    if (isObjectEqual(mine, headCoords)) {
      return "mine";
    }
  }
  return false;
};

const findMinAndMaxCoord = (
  distance: number,
  coord: number,
  boardSize: number,
  isWalls: boolean
) => {
  let min = coord - distance;
  let max = coord + distance;
  if (isWalls) {
    min = Math.max(min, 0);
    max = Math.min(max, boardSize - 1);
  } else {
    min = min < 0 ? min + boardSize : min;
    max = max > boardSize - 1 ? max % boardSize : max;
  }
  return [min, max];
};

export const findCellsInRadius = (
  distance: number,
  referenceCell: Coords,
  isWalls: boolean
) => {
  const [xMin, xMax] = findMinAndMaxCoord(
    distance,
    referenceCell.x,
    BOARD_SIZE.x,
    isWalls
  );
  const [yMin, yMax] = findMinAndMaxCoord(
    distance,
    referenceCell.y,
    BOARD_SIZE.y,
    isWalls
  );
  const xRange = rangeWithModulo(xMin, xMax, BOARD_SIZE.x);
  const yRange = rangeWithModulo(yMin, yMax, BOARD_SIZE.y);
  const cellsInSquare = [];
  for (const x of xRange) {
    for (const y of yRange) {
      cellsInSquare.push({ x, y });
    }
  }
  return cellsInSquare;
};

export const calculateRealOptionValue = (
  option: OptionName,
  value: number | boolean
) => {
  const { min, max, realMin, realMax, inverselyProportional } =
    OPTIONS_PROPERTIES[option];

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
