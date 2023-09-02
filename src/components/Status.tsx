import styles from '../styles/Status.module.scss'
import React, { useMemo } from 'react'
import { Coords } from '../constants/board'
import { calculatePointsForEatingApple } from '../helpers/score'
import { calculateRelativeSettingValue } from '../helpers/settings'
import { roundNumber } from '../utils/primitive'
import { calculateBoardRelativeWidth } from '../helpers/board'

type Props = {
    score: number
    moveRefresh: number
    mines: number
    boardSize: Coords
    tailLength: number
    apples: number
}

const statusStyle = {
    width: `${calculateBoardRelativeWidth()}vmin`
}

const Status = ({ score, moveRefresh, mines, boardSize, tailLength, apples }: Props) => {
    const speed = useMemo(() => calculateRelativeSettingValue("STARTING_MOVE_REFRESH_MS", moveRefresh), [moveRefresh])
    const nextPoints = useMemo(() => calculatePointsForEatingApple(tailLength + 1, moveRefresh, mines, boardSize, apples), [apples]) //eslint-disable-line react-hooks/exhaustive-deps

    return <div className={styles.statusBar} style={statusStyle}>
        <div className={styles.bigInfo}>
            <div>Score: {score}</div>
            <div className={styles.small}>Next: {nextPoints}</div>
        </div>
        <div className={styles.small}>
            <div>Speed: {roundNumber(speed, 1).toFixed(1)}</div>
            <div>Length: {tailLength + 1}</div>
            <div>Apples: {apples}</div>
        </div>
    </div>
}

export default Status