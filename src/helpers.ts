import { Coords, Key } from "./types";
import { BOARD_SIZE, OPPOSITE_DIRECTIONS, WALLS } from "./conts";
import { randInt, randomElement, isObjectsEqual } from "./utils";

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
  debugger;
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
  return tailCoordsInt.slice(1,).map(intToCoords);
};

export const coordsToInt = (coords: Coords) =>
  BOARD_SIZE.y * coords.y + coords.x;

export const intToCoords = (int: number) => ({
  x: int % BOARD_SIZE.x,
  y: Math.floor(int / BOARD_SIZE.x),
});

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
  isWalls: boolean = WALLS
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
  isObjectsEqual(headCoords, appleCoords);

export const isGameOver = (
  headCoords: Coords,
  tailCoords: Coords[],
  mineCoords: Coords[]
) => {
  if (WALLS && !isWithinGrid(headCoords)) {
    console.log("Crashed into a wall");
    return true;
  }
  for (let tail of tailCoords) {
    if (isObjectsEqual(tail, headCoords)) {
      console.log("Bit own tail");
      return true;
    }
  }
  for (let mine of mineCoords) {
    if (isObjectsEqual(mine, headCoords)) {
      console.log("Stepped on a mine");
      return true;
    }
  }
  return false;
};
