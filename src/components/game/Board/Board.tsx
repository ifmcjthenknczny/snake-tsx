import React, { useEffect, useMemo, useState } from 'react'
import { ELEMENTS_COLORS, CellColor, Coords } from '../../../constants/board'
import Cell from '../Cell/Cell'
import {
    coordsToInt,
    generateGridStyle,
    isWithinGrid
} from '../../../helpers/board'
import styles from './Board.module.scss'

type Props = {
    apple: Coords
    snakeHead: Coords
    snakeTail: Coords[]
    mines: Coords[]
    isWalls: boolean
    boardSize: Coords
}

const Board = (props: Props) => {
    const { apple, snakeHead, snakeTail, mines, isWalls, boardSize } = props

    const boardInitialState = useMemo(
        () => new Array<CellColor>(boardSize.x * boardSize.y).fill('darkgray'),
        [boardSize.x, boardSize.y]
    )

    const [board, setBoard] = useState<CellColor[]>(boardInitialState)
    const gridStyle = useMemo(
        () => generateGridStyle(boardSize, isWalls),
        [boardSize.x, boardSize.y, isWalls]
    )

    useEffect(() => {
        setBoard(findNewBoardState(props))
    }, [
        apple.x,
        apple.y,
        snakeHead.x,
        snakeHead.y,
        snakeTail.at(0)?.x,
        snakeTail.at(0)?.y,
        mines.at(-1)?.x,
        mines.at(-1)?.y,
        boardSize.x,
        boardSize.y
    ])

    return (
        <div className={styles.grid} style={gridStyle}>
            {board.map((color, index) => (
                <Cell key={index} color={color} />
            ))}
        </div>
    )
}

export default Board

const findNewBoardState = ({
    apple,
    snakeHead,
    snakeTail,
    mines,
    isWalls,
    boardSize
}: Props) => {
    const newBoardState = new Array<CellColor>(boardSize.x * boardSize.y).fill(
        ELEMENTS_COLORS.empty
    )
    newBoardState[coordsToInt(apple, boardSize.x)] = ELEMENTS_COLORS.apple
    snakeTail.forEach(
        (tail) =>
            (newBoardState[coordsToInt(tail, boardSize.x)] =
                ELEMENTS_COLORS.tail)
    )
    mines
        .map((coords) => coordsToInt(coords, boardSize.x))
        .forEach((mine) => (newBoardState[mine] = ELEMENTS_COLORS.mine))
    if ((isWalls && isWithinGrid(snakeHead, boardSize)) || !isWalls) {
        newBoardState[coordsToInt(snakeHead, boardSize.x)] =
            ELEMENTS_COLORS.head
    }
    return newBoardState
}
