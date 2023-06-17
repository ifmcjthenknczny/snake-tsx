import { Coords, Key } from "../types/types";
import { BOARD_SIZE } from "../constants/board";
import { OPPOSITE_DIRECTIONS } from "../constants/rules";
import { areDeepEqual } from "../utils/object";
import { coordsToInt, intToCoords, isAboutToGoOutsideGrid, isWithinGrid } from "./board";

export const generateStartingSnakeTailCoords = (
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
      const proposedTailCoords = findNextHeadPosition(
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

export const findNextHeadPosition = (
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
    areDeepEqual(headCoords, appleCoords);
  
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
      if (areDeepEqual(tail, headCoords)) {
        return "tail";
      }
    }
    for (let mine of mineCoords) {
      if (areDeepEqual(mine, headCoords)) {
        return "mine";
      }
    }
    return null;
  };