import { CellColor } from "./TYPES";

type ElementColors = {
    apple: CellColor;
    empty: CellColor;
    head: CellColor;
    tail: CellColor;
}

export const BOARD_SIZE = {
    x: 20,
    y: 20
}
export const STARTING_MOVE_REFRESH = 900;

export const SNAKE_SPEED_MULTIPLIER = 1.25;

export const ELEMENTS_COLORS: ElementColors = {
    apple: 'green',
    empty: 'darkgray',
    head: 'red',
    tail: 'blue'
}