import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CONTROL_KEYS, Key } from '../../../constants/controls'
import {
    OPPOSITE_DIRECTIONS,
    STARTING_DIRECTION,
    NEW_MINE_DISTANCE_FROM_HEAD,
    POINTS_FOR_TIME_INTERVAL_MS
} from '../../../constants/rules'
import {
    generateRandomAvailableCoords,
    findCellsInRadius
} from '../../../helpers/board'
import {
    generateStartingSnakeTailCoords,
    findNextHeadPosition,
    isEatingApple as willEatApple,
    isGameOver,
    calculateHeadStartingPosition
} from '../../../helpers/game'
import { calculatePointsForEatingApple } from '../../../helpers/score'
import styles from './Game.module.scss'
import useKeyClick from '../../../hooks/useKeyClick'
import { useDispatch } from 'react-redux'
import { increaseScore, setGameOver } from '../../../redux/slices'
import useHighScore from '../../../hooks/useHighScore'
import useGoToMenu from '../../../hooks/useGoToMenu'
import { Coords } from '../../../constants/board'
import BoardWrapper from '../BoardWrapper/BoardWrapper'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { SETTINGS_DEFAULTS } from '../../../constants/settings'
import { LOCAL_STORAGE_SETTINGS_NAME } from '../../../constants/localStorage'
import useSelector from '../../../hooks/useSelector'

const Game = () => {
    const dispatch = useDispatch()
    const { score } = useSelector()
    const [settings] = useLocalStorage(
        LOCAL_STORAGE_SETTINGS_NAME,
        SETTINGS_DEFAULTS
    )

    const boardSize = {
        x: settings.BOARD_WIDTH.real,
        y: settings.BOARD_HEIGHT.real
    } as Coords

    useGoToMenu()
    const [, maybeSetHighScore] = useHighScore()

    const headStartingPosition = useMemo(() => calculateHeadStartingPosition(boardSize), [])

    const [bodyCoords, setBodyCoords] = useState([headStartingPosition, ...generateStartingSnakeTailCoords(
                settings.STARTING_LENGTH.real as number,
                headStartingPosition,
                STARTING_DIRECTION,
                boardSize
            )])

    const [appleCoords, setAppleCoords] = useState(generateRandomAvailableCoords(
                bodyCoords,
                boardSize
            ))

    const [mineCoords, setMineCoords] = useState<Coords[]>([])

    const [moveRefresh, setMovesRefresh] = useState(
        settings.STARTING_MOVE_REFRESH_MS.real as number
    )
    const [applesEaten, setApplesEaten] = useState<number>(0)

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(bodyCoords?.at(0))
    const keyFired = useRef(false)

    const deployNewMine = () => {
        const cellsNearHead = NEW_MINE_DISTANCE_FROM_HEAD
            ? findCellsInRadius(
                NEW_MINE_DISTANCE_FROM_HEAD,
                lastHeadPositionRef.current,
                settings.WALLS.real as boolean,
                boardSize
            )
            : []

        setMineCoords((prev) => [
            ...prev,
            generateRandomAvailableCoords(
                [appleCoords, ...bodyCoords, ...cellsNearHead],
                boardSize
            )
        ])
    }

    useEffect(() => {
        const moveTimeout = setTimeout(gameIteration, moveRefresh)
        return () => {
            clearTimeout(moveTimeout)
        }
    }, [moveRefresh, bodyCoords.at(0).x, bodyCoords.at(0).y])

    useEffect(() => {
        const mineInterval = setInterval(
            deployNewMine,
            settings.NEW_MINE_INTERVAL_MS.real as number
        )
        return () => {
            clearInterval(mineInterval)
        }
    }, [])

    useEffect(() => {
        const pointsForTime = setInterval(
            () => dispatch(increaseScore(1)),
            POINTS_FOR_TIME_INTERVAL_MS
        )

        return () => {
            clearInterval(pointsForTime)
        }
    }, [])

    const gameIteration = () => {
        snakeMoveIteration()
        const gameOverReason = isGameOver(
            bodyCoords,
            mineCoords,
            settings.WALLS.real as boolean,
            boardSize
        )
        if (gameOverReason) {
            maybeSetHighScore(score)
            dispatch(setGameOver(gameOverReason))
        }
        if (willEatApple(bodyCoords.at(0), appleCoords)) {
            eatApple()
        }
    }

    const handleMove = (key: string, setKeyFired?: true) => {
        if ((CONTROL_KEYS as string[]).includes(key) && !keyFired.current) {
            if (setKeyFired) {
                keyFired.current = true
            }
            setLastKey(key as Key)
        }
    }

    const handleKeydown = (e: KeyboardEvent) => {
        handleMove(e.key, true)
    }

    const handleKeyup = () => {
        keyFired.current = false
    }

    useKeyClick(handleKeydown, handleKeyup)

    const setLastKey = (key: Key) => {
        if (key === forbiddenDirectionRef.current || key === keyRef.current)
            return
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPositionRef.current = bodyCoords.at(0)
    }

    const snakeMoveIteration = () => {
        setLastHeadPosition()
        moveBody()
        forbiddenDirectionRef.current = OPPOSITE_DIRECTIONS[keyRef.current]
    }

    const moveBody = () => {
        setBodyCoords(([prevHeadCoords, ...prevTailCoords]) => [findNextHeadPosition(
                prevHeadCoords,
                keyRef.current,
                settings.WALLS.real as boolean,
                boardSize
            ), 
            lastHeadPositionRef.current,
            ...(willEatApple(prevHeadCoords, appleCoords)
                ? prevTailCoords
                : prevTailCoords.slice(0, -1))
        ])
    }

    const eatApple = () => {
        const pointsForApple = calculatePointsForEatingApple(
            bodyCoords.length,
            moveRefresh,
            mineCoords.length,
            boardSize,
            applesEaten
        )
        setApplesEaten((prev) => {
            if (
                !(
                    (prev + 1) %
                    (settings.APPLES_TO_SPEED_UP_SNAKE.real as number)
                )
            )
                speedUpSnake()
            return prev + 1
        })
        placeNewApple()
        dispatch(increaseScore(pointsForApple))
    }

    const placeNewApple = () => {
        setAppleCoords(
            generateRandomAvailableCoords(
                [...bodyCoords, ...mineCoords, appleCoords],
                boardSize
            )
        )
    }

    const speedUpSnake = () => {
        setMovesRefresh(
            (prev) => prev / (settings.SNAKE_SPEED_MULTIPLIER.real as number)
        )
    }

    return (
        <div className={styles.game}>
            <BoardWrapper
                isWalls={settings.WALLS.real as boolean}
                score={score}
                moveRefresh={moveRefresh}
                mineCoords={mineCoords}
                boardSize={boardSize}
                bodyCoords={bodyCoords}
                appleCoords={appleCoords}
                applesEaten={applesEaten}
                handleMove={handleMove}
            />
        </div>
    )
}

export default Game
