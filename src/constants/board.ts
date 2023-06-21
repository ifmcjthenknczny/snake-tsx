export type CellColor = "green" | "red" | "blue" | "darkgray" | "black";

export type Coords = {
  x: number;
  y: number;
};

export type Element = "apple" | "empty" | "head" | "tail" | "mine";

export const BOARD_SIZE = {
  x: 20,
  y: 20,
}; // not implemented different sizes than 20x20 yet, CSS thing
export const CELLS_COUNT = BOARD_SIZE.x * BOARD_SIZE.y;
export const ELEMENTS_COLORS: Record<Element, CellColor> = {
  apple: "green",
  empty: "darkgray",
  head: "red",
  tail: "blue",
  mine: "black",
};
