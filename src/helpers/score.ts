import { SETTINGS_PROPERTIES } from "../constants/settings";
import { Coords } from "../constants/board";

export const calculatePointsForEatingApple = (
  snakeLength: number,
  snakeMoveInterval: number,
  minesOnBoard: number,
  boardSize: Coords,
  applesEaten: number
) => {
  const BOARD_SIZE_COEFF = (boardSize.x * boardSize.y) / 400;

  return (
    Math.ceil(
      ((snakeLength + minesOnBoard * 2) *
        BOARD_SIZE_COEFF *
        SETTINGS_PROPERTIES.STARTING_MOVE_REFRESH_MS.realMax) /
        snakeMoveInterval
    ) + applesEaten
  );
};
