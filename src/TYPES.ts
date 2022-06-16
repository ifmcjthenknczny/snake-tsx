export type Coords = {
    x: number;
    y: number;
}

export type GridProps = {
    applePosition: Coords;
    snakeHead: Coords;
    snakeTail: Coords[];
}

export type CellColor = 'green' | 'red' | 'blue' | 'darkgray' | 'black'

export type CellProps = {
    color: CellColor
}
export type Key = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';
