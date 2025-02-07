import React from 'react'
import { Coords } from '../../../constants/board'
import Board from '../Board/Board'
import Status from '../StatusBar/StatusBar'

type Props = {
    score: number
    moveRefresh: number
    mineCoords: Coords[]
    boardSize: Coords
    tailCoords: Coords[]
    applesEaten: number
    appleCoords: Coords
    headCoords: Coords
    isWalls: boolean
}

const BoardWrapper = ({
    score,
    moveRefresh,
    mineCoords,
    boardSize,
    tailCoords,
    applesEaten,
    appleCoords,
    headCoords,
    isWalls
}: Props) => (
    <>
        <Status
            score={score}
            moveRefresh={moveRefresh}
            mines={mineCoords.length}
            boardSize={boardSize}
            tailLength={tailCoords.length}
            apples={applesEaten}
        />
        <Board
            apple={appleCoords}
            snakeHead={headCoords}
            snakeTail={tailCoords}
            mines={mineCoords}
            isWalls={isWalls}
            boardSize={boardSize}
        />
    </>
)

export default BoardWrapper
