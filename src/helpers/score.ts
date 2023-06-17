import { BOARD_SIZE } from "../constants/board";
import { SETTINGS_PROPERTIES } from "../constants/settings";

const BOARD_SIZE_COEFF = (BOARD_SIZE.x * BOARD_SIZE.y) / 400;

export const calculatePointsForEatingApple = (
  snakeLength: number,
  snakeMoveInterval: number,
  minesPresent: number
) =>
  Math.ceil(
    (snakeLength + minesPresent * 0.5) *
      BOARD_SIZE_COEFF *
      Math.min(
        SETTINGS_PROPERTIES.STARTING_MOVE_REFRESH_MS.realMax /
          snakeMoveInterval,
        20
      )
  );
