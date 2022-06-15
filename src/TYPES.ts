export type Coords = {
    x: Number;
    y: Number;
}

export type GridProps = {
    applePosition: Coords;
    snakeHead: Coords;
    snakeTail: Coords[];
}

type CellColor = 'green' | 'red' | 'blue' | 'white' | 'black'

export type CellProps = {
    color: CellColor
}
export type Key = 'left' | 'right' | 'up' | 'down' | null;
