import { useEffect, useRef, useState } from 'react';
import { APPLES_TO_SPEED_UP, BOARD_SIZE, FORBIDDEN_DIRECTIONS, SNAKE_SPEED_MULTIPLIER, STARTING_MOVE_REFRESH, STARTING_DIRECTION } from '../CONSTANTS';
import { randomizeCoords } from '../helpers';
import { Coords } from '../TYPES';
import GameOver from './GameOver';
import Grid from './Grid';
import Score from './Score';

export default function Game() {

    // const snakeHeadPosition = useRef<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    // const snakeTailPosition = useRef<Coords[]>([])

    const [snakeSpeed, setSnakeSpeed] = useState(STARTING_MOVE_REFRESH);
    const [applePosition, setApplePosition] = useState(randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y));
    const [applesEaten, setApplesEaten] = useState(0);
    const [snakeHeadPosition, setSnakeHeadPosition] = useState<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    const [snakeTailPosition, setSnakeTailPosition] = useState<Coords[]>([])
    
    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirection = useRef<string | null>(null)
    const lastHeadPosition = useRef<Coords>(snakeHeadPosition)
    const isGameOver = useRef(false)
    let keyFired = false

    useEffect(() => {
        const moveInterval = setInterval(gameIteration, snakeSpeed)
        return () => {
            clearInterval(moveInterval)
        }
    })

    // const clearAllIntervals = () => {
    //     const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);
    //     for (let i = 1; i < interval_id; i++) {
    //         window.clearInterval(i);
    //     }
    // }

    const gameIteration = () => {
        snakeMove()
        if (checkGameOver()) isGameOver.current = true
        if (isEatingApple()) eatApple()
    }

    const setLastKey = (key: string) => {
        console.log(`curr: ${key}, forb: ${forbiddenDirection.current}`)
        if (key === forbiddenDirection.current || key === keyRef.current) return
        forbiddenDirection.current = FORBIDDEN_DIRECTIONS[key]
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPosition.current = snakeHeadPosition
    }

    const snakeMove = () => {
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
        if (snakeHeadPosition.x === applePosition.x && snakeHeadPosition.y === applePosition.y) return true
        return false
    }

    const randomizeAppleCoords = () => {
        let appleCoords: Coords;
        do {
            appleCoords = randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y)
        } while (snakeTailPosition.includes(appleCoords))
        return appleCoords
    }

    const eatApple = () => {
        // setInterval(() => setApplePosition(randomizeAppleCoords), APPLE_CHANGES_POSITION_TIME)
        setApplePosition(randomizeAppleCoords)
        setApplesEaten(prev => {
            if ((prev + 1) % APPLES_TO_SPEED_UP === 0) speedUpTheSnake()
            return prev + 1
        })
    }

    const speedUpTheSnake = () => {
        setSnakeSpeed(prev => prev / SNAKE_SPEED_MULTIPLIER)
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (keyFired) return
        keyFired = true
        setLastKey(e.key)
    }

    const handleKeyup = (e: KeyboardEvent) => {
        keyFired = false
    }

    const checkGameOver = () => {
        if (snakeHeadPosition.x >= BOARD_SIZE.x || snakeHeadPosition.x < 0 || snakeHeadPosition.y < 0 || snakeHeadPosition.y >= BOARD_SIZE.y) return true
        else {
            const headJSON = JSON.stringify(snakeHeadPosition)
            for (let tail of snakeTailPosition) {
                if (JSON.stringify(tail) === headJSON) return true
            }
        }
        return false
    }

    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyup)

    return (
        <div className="Game">
            {isGameOver.current ? <GameOver /> : ""}
            <Score score={applesEaten} />
            {!isGameOver.current ? <Grid applePosition={applePosition} snakeHead={snakeHeadPosition} snakeTail={snakeTailPosition} /> : ""}
        </div>
    )
}