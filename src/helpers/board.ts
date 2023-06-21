import { BOARD_SIZE } from "../constants/board";
import { randInt, randomElement } from "../utils/random";
import { rangeExclude } from "../utils/range";
import { rangeWithModulo } from "../utils/range";
import { Coords } from "../constants/board";
import { Key } from "../constants/keys";

export const generateRandomCoords = () => ({
  x: randInt(0, BOARD_SIZE.x),
  y: randInt(0, BOARD_SIZE.y),
});

export const generateRandomAvailableCoords = (occupiedCoords: Coords[]) => {
  const occupiedInts = occupiedCoords.map(coordsToInt);
  const availableInts = rangeExclude(
    0,
    BOARD_SIZE.x * BOARD_SIZE.y,
    occupiedInts
  );
  return intToCoords(randomElement(availableInts));
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

export const isAboutToGoOutsideGrid = (key: Key, head: Coords) => {
  if (key === "ArrowLeft" && head.x === 0) return true;
  if (key === "ArrowRight" && head.x === BOARD_SIZE.x - 1) return true;
  if (key === "ArrowUp" && head.y === 0) return true;
  if (key === "ArrowDown" && head.y === BOARD_SIZE.y - 1) return true;
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
