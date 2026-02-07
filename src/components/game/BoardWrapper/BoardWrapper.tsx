import React from 'react'
import { Coords } from '../../../constants/board'
import Board from '../Board/Board'
import Status from '../StatusBar/StatusBar'
import ClickableText from '../../common/ClickableText/ClickableText'
import useGoToMenu from '../../../hooks/useGoToMenu'
import styles from './BoardWrapper.module.scss'

export const MOBILE_GO_BACK_TEXT = 'GO BACK TO MENU'

type Props = {
    score: number
    moveRefresh: number
    mineCoords: Coords[]
    boardSize: Coords
    bodyCoords: Coords[]
    applesEaten: number
    appleCoords: Coords
    isWalls: boolean
    handleMove: (key: string) => void
}

const BoardWrapper = ({
    score,
    moveRefresh,
    mineCoords,
    boardSize,
    bodyCoords,
    applesEaten,
    appleCoords,
    isWalls,
    handleMove
}: Props) => {
    const onGoBack = useGoToMenu()
    return (
        <>
            <Status
                score={score}
                moveRefresh={moveRefresh}
                mines={mineCoords.length}
                boardSize={boardSize}
                tailLength={bodyCoords.length - 1}
                apples={applesEaten}
            />
            <Board
                apple={appleCoords}
                snakeBody={bodyCoords}
                mines={mineCoords}
                isWalls={isWalls}
                boardSize={boardSize}
                handleMove={handleMove}
            />
            <ClickableText
                text={MOBILE_GO_BACK_TEXT}
                onClick={onGoBack}
                className={styles.mobileGoBack}
            />
        </>
    )
}

export default BoardWrapper
