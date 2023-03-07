import { useEffect, useRef, useState } from 'react';
import { CONTROL_KEYS, APPLES_TO_SPEED_UP_APPLE_CHANGE_POSITION, APPLES_TO_SPEED_UP_SNAKE, APPLE_CHANGE_POSITION_INTERVAL_MS, APPLE_CHANGE_POSITION_INTERVAL_MULTIPLIER, OPPOSITE_DIRECTIONS, NEW_MINE_INTERVAL_MS, SNAKE_SPEED_MULTIPLIER, STARTING_DIRECTION, STARTING_HEAD_POSITION, STARTING_LENGTH, STARTING_MINE, STARTING_MOVE_REFRESH_MS } from '../conts';
import { generateStartingSnakeTail, nextHeadPosition, randomAvailableCoords, isEatingApple, isGameOver } from '../helpers';
import '../styles/Game.css';
import { Coords, Key } from '../types';
import Grid from './Grid';
import Score from './Score';

type Props = {
    onGameOver: (score: number) => void;
}

const Game = ({ onGameOver }: Props) => {
    const [moveRefresh, setMovesRefresh] = useState(STARTING_MOVE_REFRESH_MS);
    const [headCoords, setHeadCoords] = useState<Coords>(STARTING_HEAD_POSITION)
    const [tailCoords, setTailCoords] = useState<Coords[]>(generateStartingSnakeTail(STARTING_LENGTH, STARTING_HEAD_POSITION, STARTING_DIRECTION))

    const [applesEaten, setApplesEaten] = useState(0);
    const [appleCoords, setAppleCoords] = useState(randomAvailableCoords([headCoords, ...tailCoords]));
    const [appleRefresh, setAppleRefresh] = useState(APPLE_CHANGE_POSITION_INTERVAL_MS);

    const [mineCoords, setMineCoords] = useState<Coords[]>(STARTING_MINE ? [randomAvailableCoords([headCoords, ...tailCoords, appleCoords])] : [])

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(headCoords)
    const keyFired = useRef(false)

    const gameIteration = () => {
        snakeMoveIteration()
        if (isGameOver(headCoords, tailCoords, mineCoords)) onGameOver(applesEaten)
        if (isEatingApple(headCoords, appleCoords)) eatApple()
    }

    useEffect(() => {
        const moveTimeout = setTimeout(gameIteration, moveRefresh)
        return () => {
            clearTimeout(moveTimeout)
        }
    }, [moveRefresh, headCoords])  //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const mineInterval = setInterval(placeNewMine, NEW_MINE_INTERVAL_MS)
        return () => {
            clearInterval(mineInterval)
        }
    }, [])  //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const appleTimeout = setTimeout(placeNewApple, APPLE_CHANGE_POSITION_INTERVAL_MS)
        return () => {
            clearTimeout(appleTimeout)
        }
    }, [appleRefresh, applesEaten])  //eslint-disable-line react-hooks/exhaustive-deps

    const setLastKey = (key: Key) => {
        if (key === forbiddenDirectionRef.current || key === keyRef.current) return
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPositionRef.current = headCoords
    }

    const placeNewMine = () => {
        setMineCoords(prev => [...prev, randomAvailableCoords([appleCoords, headCoords, ...tailCoords])])
    }

    const snakeMoveIteration = () => {
        setLastHeadPosition()
        moveHead()
        moveTail()
        forbiddenDirectionRef.current = OPPOSITE_DIRECTIONS[keyRef.current]
    }

    const moveHead = () => {
        setHeadCoords(prev => nextHeadPosition(prev, keyRef.current))
    }

    const moveTail = () => {
        setTailCoords(prev => [lastHeadPositionRef.current, ...(isEatingApple(headCoords, appleCoords) ? prev : prev.slice(0, -1))])
    }

    const eatApple = () => {
        setApplesEaten(prev => {
            if (!((prev + 1) % APPLES_TO_SPEED_UP_SNAKE)) speedUpSnake()
            if (!((prev + 1) % APPLES_TO_SPEED_UP_APPLE_CHANGE_POSITION)) speedUpAppleChangingPosition()
            return prev + 1
        })
        placeNewApple()
    }

    const placeNewApple = () => {
        setAppleCoords(randomAvailableCoords([headCoords, ...tailCoords, ...mineCoords, appleCoords]))
    }

    const speedUpSnake = () => {
        setMovesRefresh(prev => prev / SNAKE_SPEED_MULTIPLIER)
    }

    const speedUpAppleChangingPosition = () => {
        setAppleRefresh(prev => prev / APPLE_CHANGE_POSITION_INTERVAL_MULTIPLIER)
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if ((CONTROL_KEYS as string[]).includes(e.key) && !keyFired.current) {
            keyFired.current = true
            setLastKey(e.key as Key)
        }
    }

    const handleKeyup = () => {
        keyFired.current = false
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)

    return (
        <div className="Game">
            <Score score={applesEaten} />
            <Grid apple={appleCoords} snakeHead={headCoords} snakeTail={tailCoords} mines={mineCoords} />
        </div>
    )
}

export default Game