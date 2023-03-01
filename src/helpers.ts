import { Coords, Key } from "./types";
import { BOARD_SIZE } from "./conts";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const randomCoords = () => ({
  x: randInt(0, BOARD_SIZE.x),
  y: randInt(0, BOARD_SIZE.y),
});

export const randomElement = <T>(array: T[]) =>
  array.length ? array[randInt(0, array.length)] : undefined;

export const randomAvailableCoords = (occupiedCoords: Coords[]) => {
  if (occupiedCoords.length) {
    const occupiedInts = occupiedCoords.map(coordsToInt);
    const availableInts = rangeExclude(
      0,
      BOARD_SIZE.x * BOARD_SIZE.y,
      occupiedInts
    );
    return intToCoords(randomElement(availableInts));
  }
  return randomCoords();
};

export const isObjectsEqual = (obj1: {}, obj2: {}) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

export const generateStartingSnakeTail = (
  startingLength: number,
  startingHeadPosition: Coords,
  startingDirection: Key
) => {
  const xImportance =
    startingDirection === "ArrowLeft"
      ? 1
      : startingDirection === "ArrowRight"
      ? -1
      : 0;
  const yImportance =
    startingDirection === "ArrowUp"
      ? 1
      : startingDirection === "ArrowDown"
      ? -1
      : 0;
  return [...Array(startingLength - 1)].map((_, i) => ({
    x: startingHeadPosition.x + (i + 1) * xImportance,
    y: startingHeadPosition.y + (i + 1) * yImportance,
  }));
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
