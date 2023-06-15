import React, { useEffect, useMemo, useState } from "react";
import { BOARD_SIZE, ELEMENTS_COLORS, CELLS_COUNT } from "../utils/consts";
import { CellColor, Coords } from "../utils/types";
import Cell from "./Cell";
import { coordsToInt, isWithinGrid } from "../utils/helpers";

type Props = {
    apple: Coords;
    snakeHead: Coords;
    snakeTail: Coords[];
    mines: Coords[]
    isWalls: boolean
}

const Grid = ({ apple, snakeHead, snakeTail, mines, isWalls }: Props) => {
    const [grid, setGrid] = useState<CellColor[]>(new Array<CellColor>(CELLS_COUNT).fill('darkgray'))

    const appleIntCoords = useMemo(() => coordsToInt(apple), [apple])
    const minesIntCoords = useMemo(() => mines.map((coords) => coordsToInt(coords)), [mines])

    const GRID_STYLE = {
        width: `calc(3.5vmin * ${BOARD_SIZE.x} + 0.4vmin * ${BOARD_SIZE.x - 1})`,
        height: `calc(3.5vmin * ${BOARD_SIZE.y} + 0.4vmin * ${BOARD_SIZE.y - 1})`,
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_SIZE.x}, 3.5vmin)`,
        gridTemplateRows: `repeat(${BOARD_SIZE.y}, 3.5vmin)`,
        gridColumnGap: "0.4vmin",
        gridRowGap: "0.4vmin",
        border: `${isWalls ? 10 : 2}px black solid`,
        justifySelf: "center",
        alignSelf: "center",
        cursor: "none",
    }

    useEffect(() => {
        setCellColors()
    }, [apple, snakeHead, snakeTail, mines]) //eslint-disable-line react-hooks/exhaustive-deps

    const setCellColors = () => {
        const newGridState = new Array<CellColor>(CELLS_COUNT).fill(ELEMENTS_COLORS.empty);
        newGridState[appleIntCoords] = ELEMENTS_COLORS.apple;
        snakeTail.forEach(tail => newGridState[coordsToInt(tail)] = ELEMENTS_COLORS.tail);
        minesIntCoords.forEach(mine => newGridState[mine] = ELEMENTS_COLORS.mine);
        if ((isWalls && isWithinGrid(snakeHead)) || !isWalls) {
            newGridState[coordsToInt(snakeHead)] = ELEMENTS_COLORS.head;
        }
        setGrid(newGridState)
    }

    return (
        <div style={GRID_STYLE}>
            {grid.map((color, index) => <Cell key={index} color={color} />)}
        </div>
    )
}

export default Grid