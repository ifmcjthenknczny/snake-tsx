import { useEffect, useRef, useState } from 'react';
import { APPLES_TO_SPEED_UP, BOARD_SIZE, FORBIDDEN_DIRECTIONS, SNAKE_SPEED_MULTIPLIER, STARTING_DIRECTION, STARTING_MOVE_REFRESH } from '../CONSTANTS';
import { randomizeCoordsOnEmptySquares, isObjectsEqual } from '../helpers';
import '../styles/Game.css';
import { Coords } from '../TYPES';
import Grid from './Grid';
import Score from './Score';

type GameProps = {
    onGameOver: (score: number) => void;
}

export default function Game(props: GameProps) {

    const [snakeSpeed, setSnakeSpeed] = useState(STARTING_MOVE_REFRESH);
    const [applesEaten, setApplesEaten] = useState(0);

    const [snakeHeadPosition, setSnakeHeadPosition] = useState<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    const [snakeTailPosition, setSnakeTailPosition] = useState<Coords[]>([])

    const [applePosition, setApplePosition] = useState(randomizeCoordsOnEmptySquares(BOARD_SIZE.x, BOARD_SIZE.y, [snakeHeadPosition]));
    // const [minePosition, setMinePosition] = useState<Coords[]>(randomizeCoordsOnEmptySquares(BOARD_SIZE.x, BOARD_SIZE.y, [applePosition, snakeHeadPosition]))

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirection = useRef<string | null>(null)
    const lastHeadPosition = useRef<Coords>(snakeHeadPosition)
    const keyFired = useRef(false)

    useEffect(() => {
        const moveInterval = setInterval(gameIteration, snakeSpeed)
        return () => {
            clearInterval(moveInterval)
        }
    })

    const gameIteration = () => {
        snakeMove()
        if (checkGameOver()) props.onGameOver(applesEaten)
        if (isEatingApple()) eatApple()
    }

    const setLastKey = (key: string) => {
        console.log(`curr: ${key}, forb: ${forbiddenDirection.current}`)
        if (key === forbiddenDirection.current || key === keyRef.current) return
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPosition.current = snakeHeadPosition
    }

    const snakeMove = () => {
        if (applesEaten > 0) forbiddenDirection.current = FORBIDDEN_DIRECTIONS[keyRef.current]
        setLastHeadPosition()
        switch (keyRef.current) {
            case "ArrowUp": {
                setSnakeHeadPosition(prev => ({
                    ...prev, y: prev.y - 1
                }))
                break;
            }
            case "ArrowDown": {
                setSnakeHeadPosition(prev => ({
                    ...prev, y: prev.y + 1
                }))
                break;
            }
            case "ArrowLeft": {
                setSnakeHeadPosition(prev => ({
                    ...prev, x: prev.x - 1
                }))
                break;
            }
            case "ArrowRight": {
                setSnakeHeadPosition(prev => ({
                    ...prev, x: prev.x + 1
                }))
                break;
            }
        }
        if (!isEatingApple()) {
            setSnakeTailPosition(prev => {
                prev.pop()
                if (applesEaten > 0) prev.unshift(lastHeadPosition.current)
                return prev
            })
        } else {
            setSnakeTailPosition(prev => {
                prev.unshift(lastHeadPosition.current)
                return prev
            })
        }
    }

    const isEatingApple = () => {
        if (isObjectsEqual(snakeHeadPosition, applePosition)) return true
        return false
    }

    const eatApple = () => {
        // setInterval(() => setApplePosition(randomizeAppleCoords), APPLE_CHANGES_POSITION_TIME)
        setApplePosition(randomizeCoordsOnEmptySquares(BOARD_SIZE.x, BOARD_SIZE.y, [snakeHeadPosition, ...snakeTailPosition]))
        setApplesEaten(prev => {
            if ((prev + 1) % APPLES_TO_SPEED_UP === 0) speedUpTheSnake()
            return prev + 1
        })
    }

    const speedUpTheSnake = () => {
        setSnakeSpeed(prev => prev / SNAKE_SPEED_MULTIPLIER)
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (keyFired.current) return
        keyFired.current = true
        // if (e.key !== keyRef.current) snakeMove()
        setLastKey(e.key)
    }

    const handleKeyup = (e: KeyboardEvent) => {
        keyFired.current = false
    }

    const checkGameOver = () => {
        if (snakeHeadPosition.x >= BOARD_SIZE.x || snakeHeadPosition.x < 0 || snakeHeadPosition.y < 0 || snakeHeadPosition.y >= BOARD_SIZE.y) return true
        else {
            for (let tail of snakeTailPosition) {
                if (isObjectsEqual(tail, snakeHeadPosition)) return true
            }
        }
        return false
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)

    return (
        <div className="Game">
            <Score score={applesEaten} />
            <Grid applePosition={applePosition} snakeHead={snakeHeadPosition} snakeTail={snakeTailPosition} />
        </div>
    )
}