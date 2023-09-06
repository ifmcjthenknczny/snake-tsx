import styles from '../styles/Status.module.scss'
import React, { useMemo } from 'react'
import { Coords } from '../constants/board'
import { calculatePointsForEatingApple } from '../helpers/score'
import { calculateRelativeSettingValue } from '../helpers/settings'
import { roundNumber } from '../utils/primitive'
import { calculateBoardRelativeSize } from '../helpers/board'

type Props = {
    score: number
    moveRefresh: number
    mines: number
    boardSize: Coords
    tailLength: number
    apples: number
}

const Status = ({ score, moveRefresh, mines, boardSize, tailLength, apples }: Props) => {
    const speed = useMemo(() => calculateRelativeSettingValue("STARTING_MOVE_REFRESH_MS", moveRefresh), [moveRefresh])
    const statusStyle = useMemo(() => {
        const { value, unit } = calculateBoardRelativeSize(boardSize)
        return ({ width: `${unit === 'vw' ? value : Math.max(value * boardSize.x / boardSize.y, 36)}${unit}` })
    }, [boardSize.x, boardSize.y]) //eslint-disable-line react-hooks/exhaustive-deps
    const nextPoints = calculatePointsForEatingApple(tailLength + 1, moveRefresh, mines, boardSize, apples)

    return <div className={styles.statusBar} style={statusStyle}>
        <div className={styles.bigInfo}>
            <div>Score: {score}</div>
            <div className={styles.small}>Next: {nextPoints}</div>
        </div>
        <div className={styles.small}>
            <div>Speed: {roundNumber(speed as number, 1).toFixed(1)}</div>
            <div>Length: {tailLength + 1}</div>
            <div>Apples: {apples}</div>
        </div>
    </div>
}

export default Status