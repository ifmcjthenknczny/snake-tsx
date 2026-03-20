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
    isEatingApple,
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

type GameState = {
    bodyCoords: Coords[]
    appleCoords: Coords
    mineCoords: Coords[]
    moveRefresh: number
    applesEaten: number
}

const createInitialGameState = (
    boardSize: Coords,
    startingLength: number,
    startingMoveRefreshMs: number
): GameState => {
    const headStartingPosition = calculateHeadStartingPosition(boardSize)
    const bodyCoords = [
        headStartingPosition,
        ...generateStartingSnakeTailCoords(
            startingLength,
            headStartingPosition,
            STARTING_DIRECTION,
            boardSize
        )
    ]
    return {
        bodyCoords,
        appleCoords: generateRandomAvailableCoords(bodyCoords, boardSize),
        mineCoords: [],
        moveRefresh: startingMoveRefreshMs,
        applesEaten: 0
    }
}

const Game = () => {
    const dispatch = useDispatch()
    const { score } = useSelector()
    const [settings] = useLocalStorage(
        LOCAL_STORAGE_SETTINGS_NAME,
        SETTINGS_DEFAULTS
    )

    const boardSize = useMemo(
        () => ({
            x: settings.BOARD_WIDTH.real,
            y: settings.BOARD_HEIGHT.real
        }) as Coords,
        [settings.BOARD_WIDTH.real, settings.BOARD_HEIGHT.real]
    )

    useGoToMenu()
    const [, maybeSetHighScore] = useHighScore()

    const [gameState, setGameState] = useState<GameState>(() =>
        createInitialGameState(
            boardSize,
            settings.STARTING_LENGTH.real as number,
            settings.STARTING_MOVE_REFRESH_MS.real as number
        )
    )

    const { bodyCoords, appleCoords, mineCoords, moveRefresh, applesEaten } = gameState

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords | undefined>(bodyCoords?.at(0))
    const keyFired = useRef(false)

    const deployNewMine = () => {
        setGameState((prev) => {
            const head = prev.bodyCoords[0]
            const cellsNearHead = head && NEW_MINE_DISTANCE_FROM_HEAD
                ? findCellsInRadius(
                    NEW_MINE_DISTANCE_FROM_HEAD,
                    head,
                    settings.WALLS.real as boolean,
                    boardSize
                )
                : []
            return {
                ...prev,
                mineCoords: [
                    ...prev.mineCoords,
                    generateRandomAvailableCoords(
                        [prev.appleCoords, ...prev.bodyCoords, ...cellsNearHead],
                        boardSize
                    )
                ]
            }
        })
    }

    useEffect(() => {
        const moveTimeout = setTimeout(gameIteration, moveRefresh)
        return () => {
            clearTimeout(moveTimeout)
        }
    }, [moveRefresh, bodyCoords.at(0)?.x, bodyCoords.at(0)?.y])

    useEffect(() => {
        if (settings.NEW_MINE_INTERVAL_MS.relative === 0) {
            return
        }
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
        if (isEatingApple(bodyCoords.at(0), appleCoords)) {
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
        lastHeadPositionRef.current = gameState.bodyCoords.at(0)
    }

    const snakeMoveIteration = () => {
        setLastHeadPosition()
        moveBody()
        forbiddenDirectionRef.current = OPPOSITE_DIRECTIONS[keyRef.current]
    }

    const moveBody = () => {
        setGameState((prev) => {
            const [prevHeadCoords, ...prevTailCoords] = prev.bodyCoords
            const newHead = findNextHeadPosition(
                prevHeadCoords,
                keyRef.current,
                settings.WALLS.real as boolean,
                boardSize
            )
            return {
                ...prev,
                bodyCoords: [
                    newHead,
                    lastHeadPositionRef.current ?? prevHeadCoords,
                    ...(isEatingApple(prevHeadCoords, prev.appleCoords)
                        ? prevTailCoords
                        : prevTailCoords.slice(0, -1))
                ]
            }
        })
    }

    const eatApple = () => {
        const pointsForApple = calculatePointsForEatingApple(
            bodyCoords.length,
            moveRefresh,
            mineCoords.length,
            boardSize,
            applesEaten
        )
        setGameState((prev) => {
            const newApplesEaten = prev.applesEaten + 1
            const shouldSpeedUp =
                newApplesEaten % (settings.APPLES_TO_SPEED_UP_SNAKE.real as number) === 0
            return {
                ...prev,
                applesEaten: newApplesEaten,
                appleCoords: generateRandomAvailableCoords(
                    [...prev.bodyCoords, ...prev.mineCoords, prev.appleCoords],
                    boardSize
                ),
                moveRefresh: shouldSpeedUp
                    ? prev.moveRefresh / (settings.SNAKE_SPEED_MULTIPLIER.real as number)
                    : prev.moveRefresh
            }
        })
        dispatch(increaseScore(pointsForApple))
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
