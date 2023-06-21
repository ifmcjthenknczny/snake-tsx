import React, { useEffect, useState } from "react";
import { BOARD_SIZE, ELEMENTS_COLORS, CELLS_COUNT, CellColor, Coords } from "../constants/board";
import Cell from "./Cell";
import { coordsToInt, isWithinGrid } from "../helpers/board";
import styles from '../styles/Grid.module.scss'

type Props = {
    apple: Coords;
    snakeHead: Coords;
    snakeTail: Coords[];
    mines: Coords[]
    isWalls: boolean
}

const Board = (props: Props) => {
    const [board, setBoard] = useState<CellColor[]>(new Array<CellColor>(CELLS_COUNT).fill('darkgray'))
    const { apple, snakeHead, snakeTail, mines, isWalls } = props

    const GRID_STYLE = {
        width: `calc(3.5vmin * ${BOARD_SIZE.x} + 0.4vmin * ${BOARD_SIZE.x - 1})`,
        height: `calc(3.5vmin * ${BOARD_SIZE.y} + 0.4vmin * ${BOARD_SIZE.y - 1})`,
        gridTemplateColumns: `repeat(${BOARD_SIZE.x}, 3.5vmin)`,
        gridTemplateRows: `repeat(${BOARD_SIZE.y}, 3.5vmin)`,
        border: `${isWalls ? 10 : 2}px black solid`,
    }

    useEffect(() => {
        setBoard(findNewBoardState(props))
    }, [apple.x, apple.y, snakeHead.x, snakeHead.y, snakeTail.at(0)?.x, snakeTail.at(0)?.y, mines.at(-1)?.x, mines.at(-1)?.y]) //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={styles.grid} style={GRID_STYLE}>
            {board.map((color, index) => <Cell key={index} color={color} />)}
        </div>
    )
}

export default Board

const findNewBoardState = ({ apple, snakeHead, snakeTail, mines, isWalls }: Props) => {
    const newBoardState = new Array<CellColor>(CELLS_COUNT).fill(ELEMENTS_COLORS.empty);
    newBoardState[coordsToInt(apple)] = ELEMENTS_COLORS.apple;
    snakeTail.forEach(tail => newBoardState[coordsToInt(tail)] = ELEMENTS_COLORS.tail);
    mines.map((coords) => coordsToInt(coords)).forEach(mine => newBoardState[mine] = ELEMENTS_COLORS.mine);
    if ((isWalls && isWithinGrid(snakeHead)) || !isWalls) {
        newBoardState[coordsToInt(snakeHead)] = ELEMENTS_COLORS.head;
    }
    return newBoardState
}