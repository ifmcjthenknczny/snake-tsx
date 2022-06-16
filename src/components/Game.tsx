import { useEffect, useRef, useState } from 'react';
import { APPLES_TO_SPEED_UP, BOARD_SIZE, SNAKE_SPEED_MULTIPLIER, STARTING_MOVE_REFRESH } from '../CONSTANTS';
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
    const [isGameOver, setIsGameOver] = useState(false)
    // const [lastKey, setLastKey] = useState("ArrowLeft");
    const [applesEaten, setApplesEaten] = useState(0);
    const [snakeHeadPosition, setSnakeHeadPosition] = useState<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    const [snakeTailPosition, setSnakeTailPosition] = useState<Coords[]>([])

    const keyRef = useRef("ArrowLeft")
    const prevKeyRef = useRef("ArrowRight")
    const lastHeadPosition = useRef<Coords>(snakeHeadPosition)
    const forbiddenDirection = useState

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
        if (checkGameOver()) setIsGameOver(true)
        if (isEatingApple()) eatApple()
    }

    const setLastKey = (key: string) => {
        if (prevKeyRef.current === "ArrowDown" && key === "ArrowUp") return
        else if (prevKeyRef.current === "ArrowUp" && key === "ArrowDown") return
        else if (prevKeyRef.current === "ArrowLeft" && key === "ArrowRight") return
        else if (prevKeyRef.current === "ArrowRight" && key === "ArrowLeft") return
        else {
            prevKeyRef.current = keyRef.current
            keyRef.current = key
        }
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

    const eatApple = () => {
        let appleCoords: Coords;
        do {
            appleCoords = randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y)
        } while (snakeTailPosition.includes(appleCoords))

        setApplePosition(appleCoords)
        setApplesEaten(prev => {
            if ((prev + 1) % APPLES_TO_SPEED_UP === 0) speedUpTheSnake()
            return prev + 1
        })
        // setSnakeTailPosition(prev => [snakeHeadPosition, ...prev])
        // setSnakeTailPosition(prev => [...prev, lastTailPosition.current])
    }

    const speedUpTheSnake = () => {
        setSnakeSpeed(prev => prev / SNAKE_SPEED_MULTIPLIER)
    }

    const handleKeydown = (e: KeyboardEvent) => {
        setLastKey(e.key)
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

    document.addEventListener('keydown', handleKeydown) //useRef?

    return (
        <div className="Game">
            {isGameOver ? <GameOver /> : ""}
            <Score score={applesEaten} />
            {!isGameOver ? <Grid applePosition={applePosition} snakeHead={snakeHeadPosition} snakeTail={snakeTailPosition} /> : ""}
        </div>
    )
}