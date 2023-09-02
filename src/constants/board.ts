export type CellColor = "green" | "red" | "blue" | "darkgray" | "black";

export type Coords = {
  x: number;
  y: number;
};

export type Element = "apple" | "empty" | "head" | "tail" | "mine";

export const ELEMENTS_COLORS: Record<Element, CellColor> = {
  apple: "green",
  empty: "darkgray",
  head: "red",
  tail: "blue",
  mine: "black",
};

export const BOARD_RELATIVE_WINDOW_SIZE = 80;

export const GAP_TO_CELL_RATIO = 0.1;
