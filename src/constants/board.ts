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

export const HEIGHT_DEPENDENT_BOARD_SIZE = { value: 95, unit: 'vw' }
export const WIDTH_DEPENDENT_BOARD_SIZE = { value: 90, unit: 'vh' }

export const GAP_TO_CELL_RATIO = 0.1;
