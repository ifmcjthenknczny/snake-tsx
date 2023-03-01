export type Coords = {
    x: number;
    y: number;
}

export type CellColor = 'green' | 'red' | 'blue' | 'darkgray' | 'black'

export type Key = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

type Element = 'apple' | 'empty' | 'head' | 'tail' | 'mine'

export type ElementColors = Record<Element, CellColor>

export type Ms = number