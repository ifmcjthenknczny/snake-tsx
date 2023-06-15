import React, { useEffect, useRef, useState } from 'react';
import { CONTROL_KEYS, OPPOSITE_DIRECTIONS, STARTING_DIRECTION, STARTING_HEAD_POSITION, STARTING_MINE, NEW_MINE_DISTANCE_FROM_HEAD, MENU_KEY } from '../utils/consts';
import { generateStartingSnakeTail, nextHeadPosition, randomAvailableCoords, isEatingApple, isGameOver, findCellsInRadius, pointsForEatingApple } from '../utils/helpers';
import '../styles/Game.css';
import { Coords, Key, OptionsWithValue } from '../utils/types';
import Grid from './Grid';
import Score from './Score';
import { GameOverReason } from '../utils/types';
import { useKeyClick } from '../utils/hooks';

type Props = {
    onGameOver: (score: number, reason: GameOverReason) => void;
    handleMenu: () => void;
    settings: OptionsWithValue
}

const Game = ({ onGameOver, handleMenu, settings }: Props) => {
    const [moveRefresh, setMovesRefresh] = useState(settings.STARTING_MOVE_REFRESH_MS as number);
    const [headCoords, setHeadCoords] = useState<Coords>(STARTING_HEAD_POSITION)
    const [tailCoords, setTailCoords] = useState<Coords[]>(generateStartingSnakeTail(settings.STARTING_LENGTH as number, STARTING_HEAD_POSITION, STARTING_DIRECTION))

    const [, setApplesEaten] = useState(0);
    const [appleCoords, setAppleCoords] = useState(randomAvailableCoords([headCoords, ...tailCoords]));
    const [points, setPoints] = useState(0)

    const [mineCoords, setMineCoords] = useState<Coords[]>(STARTING_MINE ? [randomAvailableCoords([headCoords, ...tailCoords, appleCoords])] : [])

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(headCoords)
    const keyFired = useRef(false)

    const gameIteration = () => {
        snakeMoveIteration()
        const gameOver = isGameOver(headCoords, tailCoords, mineCoords, settings.WALLS as boolean)
        if (gameOver) {
            onGameOver(points, gameOver)
        }
        if (isEatingApple(headCoords, appleCoords)) {
            eatApple()
        }
    }

    useEffect(() => {
        const moveTimeout = setTimeout(gameIteration, moveRefresh)
        return () => {
            clearTimeout(moveTimeout)
        }
    }, [moveRefresh, headCoords.x, headCoords.y])  //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const mineInterval = setInterval(deployNewMine, settings.NEW_MINE_INTERVAL_MS as number)
        return () => {
            clearInterval(mineInterval)
        }
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    const handleKeydown = (e: KeyboardEvent) => {
        if ((CONTROL_KEYS as string[]).includes(e.key) && !keyFired.current) {
            keyFired.current = true
            setLastKey(e.key as Key)
        }
        else if (e.key === MENU_KEY) {
            handleMenu()
        }
    }

    const handleKeyup = () => {
        keyFired.current = false
    }

    useKeyClick(handleKeydown, handleKeyup)

    const setLastKey = (key: Key) => {
        if (key === forbiddenDirectionRef.current || key === keyRef.current) return
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPositionRef.current = headCoords
    }

    const deployNewMine = () => {
        const cellsNearHead = NEW_MINE_DISTANCE_FROM_HEAD ? findCellsInRadius(NEW_MINE_DISTANCE_FROM_HEAD, lastHeadPositionRef.current, settings.WALLS as boolean) : []
        setMineCoords(prev => [...prev, randomAvailableCoords([appleCoords, headCoords, ...tailCoords, ...cellsNearHead])])
    }

    const snakeMoveIteration = () => {
        setLastHeadPosition()
        moveHead()
        moveTail()
        forbiddenDirectionRef.current = OPPOSITE_DIRECTIONS[keyRef.current]
    }

    const moveHead = () => {
        setHeadCoords(prev => nextHeadPosition(prev, keyRef.current, settings.WALLS as boolean))
    }

    const moveTail = () => {
        setTailCoords(prev => [lastHeadPositionRef.current, ...(isEatingApple(headCoords, appleCoords) ? prev : prev.slice(0, -1))])
    }

    const eatApple = () => {
        setApplesEaten(prev => {
            if (!((prev + 1) % (settings.APPLES_TO_SPEED_UP_SNAKE as number))) speedUpSnake()
            return prev + 1
        })
        placeNewApple()
        setPoints((prev) => prev + pointsForEatingApple(tailCoords.length + 1, moveRefresh, mineCoords.length))
    }

    const placeNewApple = () => {
        setAppleCoords(randomAvailableCoords([headCoords, ...tailCoords, ...mineCoords, appleCoords]))
    }

    const speedUpSnake = () => {
        setMovesRefresh(prev => prev / (settings.SNAKE_SPEED_MULTIPLIER as number))
    }

    return (
        <div className="Game">
            <Score score={points} />
            <Grid apple={appleCoords} snakeHead={headCoords} snakeTail={tailCoords} mines={mineCoords} isWalls={settings.WALLS as boolean} />
        </div>
    )
}

export default Game