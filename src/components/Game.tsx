import { useEffect, useRef, useState } from 'react';
import { ACCEPTED_KEYS, APPLES_TO_SPEED_UP, FORBIDDEN_DIRECTIONS, NEW_MINE_INTERVAL, SNAKE_SPEED_MULTIPLIER, STARTING_DIRECTION, STARTING_HEAD_POSITION, STARTING_LENGTH, STARTING_MINE, STARTING_MOVE_REFRESH, WALLS } from '../conts';
import { generateStartingSnakeTail, isObjectsEqual, isWithinGrid, randomAvailableCoords } from '../helpers';
import '../styles/Game.css';
import { Coords, Key } from '../types';
import Grid from './Grid';
import Score from './Score';

type Props = {
    onGameOver: (score: number) => void;
}

const Game = ({ onGameOver }: Props) => {
    const [moveRefresh, setMovesRefresh] = useState(STARTING_MOVE_REFRESH);
    const [applesEaten, setApplesEaten] = useState(0);

    const [headCoords, setHeadCoords] = useState<Coords>(STARTING_HEAD_POSITION)
    const [tailCoords, setTailCoords] = useState<Coords[]>(generateStartingSnakeTail(STARTING_LENGTH, STARTING_HEAD_POSITION, STARTING_DIRECTION))

    const [appleCoords, setAppleCoords] = useState(randomAvailableCoords([headCoords, ...tailCoords]));
    const [mineCoords, setMineCoords] = useState<Coords[]>(STARTING_MINE ? [randomAvailableCoords([headCoords, ...tailCoords, appleCoords])] : [])

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(headCoords)
    const keyFired = useRef(false)

    const gameIteration = () => {
        snakeMoveIteration()
        if (isGameOver()) onGameOver(applesEaten)
        if (isEatingApple()) eatApple()
    }

    useEffect(() => {
        const moveTimeout = setTimeout(gameIteration, moveRefresh)
        return () => {
            clearTimeout(moveTimeout)
        }
    }, [moveRefresh, headCoords])  //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const mineInterval = setInterval(placeNewMine, NEW_MINE_INTERVAL)
        return () => {
            clearInterval(mineInterval)
        }
    }, [])  //eslint-disable-line react-hooks/exhaustive-deps

    const setLastKey = (key: Key) => {
        if (key === forbiddenDirectionRef.current || key === keyRef.current) return
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPositionRef.current = headCoords
    }

    const placeNewMine = () => {
        const newMineCoords = randomAvailableCoords([appleCoords, headCoords, ...tailCoords])
        setMineCoords(prev => [...prev, newMineCoords])
    }

    const snakeMoveIteration = () => {
        setLastHeadPosition()
        moveBody()
        forbiddenDirectionRef.current = FORBIDDEN_DIRECTIONS[keyRef.current]
    }

    const moveHead = () => {
        const moveHeadDifference = (prev: Coords) => ({
            ArrowUp: { y: (prev.y - 1) },
            ArrowDown: { y: (prev.y + 1) },
            ArrowLeft: { x: (prev.x - 1) },
            ArrowRight: { x: (prev.x + 1) }
        })
        setHeadCoords(prev => ({...prev, ...moveHeadDifference(prev)[keyRef.current]}))
    }

    const moveTail = () => {
        setTailCoords(prev => [lastHeadPositionRef.current, ...(isEatingApple() ? prev : prev.slice(0, -1))])
    }

    const moveBody = () => {
        moveHead()
        moveTail()
    }

    const isEatingApple = () => isObjectsEqual(headCoords, appleCoords)

    const eatApple = () => {
        placeNewApple()
        setApplesEaten(prev => {
            if (!((prev + 1) % APPLES_TO_SPEED_UP)) speedUpSnake()
            return prev + 1
        })
    }

    const placeNewApple = () => {
        setAppleCoords(randomAvailableCoords([headCoords, ...tailCoords, ...mineCoords]))
    }

    const speedUpSnake = () => {
        setMovesRefresh(prev => prev / SNAKE_SPEED_MULTIPLIER)
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (keyFired.current) return
        if ((ACCEPTED_KEYS as string[]).includes(e.key)) {
            keyFired.current = true
            setLastKey(e.key as Key)
        }
    }

    const handleKeyup = () => {
        keyFired.current = false
    }

    const isGameOver = () => {
        if (WALLS && !isWithinGrid(headCoords)) {
            console.log("Crashed into a wall")
            return true
        }
        for (let tail of tailCoords) {
            if (isObjectsEqual(tail, headCoords)) {
                console.log("Bit own tail")
                return true
            }
        }

        for (let mine of mineCoords) {
            if (isObjectsEqual(mine, headCoords)) {
                console.log("Stepped on a mine")
                return true
            }
        }
        return false
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