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

    const [snakeHeadPosition, setSnakeHeadPosition] = useState<Coords>(STARTING_HEAD_POSITION)
    const [snakeTailPositions, setSnakeTailPositions] = useState<Coords[]>(generateStartingSnakeTail(STARTING_LENGTH, STARTING_HEAD_POSITION, STARTING_DIRECTION))

    const [applePosition, setApplePosition] = useState(randomAvailableCoords([snakeHeadPosition, ...snakeTailPositions]));
    const [minePositions, setMinePositions] = useState<Coords[]>(STARTING_MINE ? [randomAvailableCoords([snakeHeadPosition, ...snakeTailPositions, applePosition])] : [])

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(snakeHeadPosition)
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
    }, [moveRefresh, snakeHeadPosition])  //eslint-disable-line react-hooks/exhaustive-deps

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
        lastHeadPositionRef.current = snakeHeadPosition
    }

    const placeNewMine = () => {
        const newMineCoords = randomAvailableCoords([applePosition, snakeHeadPosition, ...snakeTailPositions])
        setMinePositions(prev => [...prev, newMineCoords])
    }

    const snakeMoveIteration = () => {
        setLastHeadPosition()
        moveBody()
        forbiddenDirectionRef.current = FORBIDDEN_DIRECTIONS[keyRef.current]
    }

    const moveBody = () => {
        switch (keyRef.current) {
            case "ArrowUp": {
                setSnakeHeadPosition(prev => ({
                    ...prev, y: (prev.y - 1)
                }))
                break;
            }
            case "ArrowDown": {
                setSnakeHeadPosition(prev => ({
                    ...prev, y: (prev.y + 1)
                }))
                break;
            }
            case "ArrowLeft": {
                setSnakeHeadPosition(prev => ({
                    ...prev, x: (prev.x - 1)
                }))
                break;
            }
            case "ArrowRight": {
                setSnakeHeadPosition(prev => ({
                    ...prev, x: (prev.x + 1)
                }))
                break;
            }
        }
        setSnakeTailPositions(prev => [lastHeadPositionRef.current, ...(isEatingApple() ? prev : prev.slice(0, -1))])
    }

    const isEatingApple = () => isObjectsEqual(snakeHeadPosition, applePosition)

    const eatApple = () => {
        placeNewApple()
        setApplesEaten(prev => {
            if (!((prev + 1) % APPLES_TO_SPEED_UP)) speedUpTheSnake()
            return prev + 1
        })
    }

    const placeNewApple = () => {
        setApplePosition(randomAvailableCoords([snakeHeadPosition, ...snakeTailPositions, ...minePositions]))
    }

    const speedUpTheSnake = () => {
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
        if (WALLS && !isWithinGrid(snakeHeadPosition)) {
            console.log("Crashed into a wall")
            return true
        }
        for (let tail of snakeTailPositions) {
            if (isObjectsEqual(tail, snakeHeadPosition)) {
                console.log("Bit own tail")
                return true
            }
        }

        for (let mine of minePositions) {
            if (isObjectsEqual(mine, snakeHeadPosition)) {
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
            <Grid apple={applePosition} snakeHead={snakeHeadPosition} snakeTail={snakeTailPositions} mines={minePositions} />
        </div>
    )
}

export default Game