import React, { useMemo } from 'react'
import { ELEMENTS_COLORS, CellColor, Coords } from '../../../constants/board'
import Cell from '../Cell/Cell'
import {
    coordsToInt,
    generateGridStyle,
    isWithinGrid
} from '../../../helpers/board'
import styles from './Board.module.scss'
import MobileTouchControls from '../MobileTouchControls/MobileTouchControls'

type Props = {
    apple: Coords
    snakeBody: Coords[]
    mines: Coords[]
    isWalls: boolean
    boardSize: Coords
    handleMove: (key: string) => void
}

const Board = (props: Props) => {
    const { snakeBody, isWalls, boardSize } = props

    const board = useMemo(() => findNewBoardState(props), [
        snakeBody.at(0).x,
        snakeBody.at(0).y,
    ])

    const gridStyle = useMemo(
        () => generateGridStyle(boardSize, isWalls),
        [boardSize.x, boardSize.y, isWalls]
    )

    return (
        <MobileTouchControls handleMove={props.handleMove}>
            <div className={styles.grid} style={gridStyle}>
                {board.map((color, index) => (
                    <Cell key={index} color={color} />
                ))}
            </div>
        </MobileTouchControls>
    )
}

export default Board

const findNewBoardState = ({
    apple,
    snakeBody,
    mines,
    isWalls,
    boardSize
}: Props) => {
    const [snakeHead, ...snakeTail] = snakeBody
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
