import { useEffect, useState, useRef } from 'react';
import { BOARD_SIZE, STARTING_MOVE_REFRESH, SNAKE_SPEED_MULTIPLIER } from '../CONSTANTS';
import { randomizeCoords } from '../helpers';
import { Coords } from '../TYPES';
import Grid from './Grid';

export default function Game() {
    const lastKey = useRef("ArrowLeft")
    // const applePosition = useRef<Coords>(randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y))
    // const snakeHeadPosition = useRef<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    // const snakeTailPosition = useRef<Coords[]>([])

    const [snakeSpeed, setSnakeSpeed] = useState(STARTING_MOVE_REFRESH);
    const [applePosition, setApplePosition] = useState(randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y));
    // const [lastKey, setLastKey] = useState("ArrowLeft");
    const [applesEaten, setApplesEaten] = useState(0);
    const [snakeHeadPosition, setSnakeHeadPosition] = useState<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    const [snakeTailPositions, setSnakeTailsPositions] = useState<Coords[]>([])

    useEffect(() => {
        const moveInterval = setInterval(gameIteration, snakeSpeed)
        return () => {
            clearInterval(moveInterval)
        }
    }, [snakeSpeed])

    const gameIteration = () => {
        snakeMove()
        console.log(snakeHeadPosition, applePosition)
        if (snakeHeadPosition.x === applePosition.x && snakeHeadPosition.y === applePosition.y) {
            setApplePosition(randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y))
            setApplesEaten(prev => prev + 1)
            speedUpTheSnake()
        }
    }

    const setLastKey = (key: string) => lastKey.current = key

    const snakeMove = () => {
        switch (lastKey.current) {
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
    }

    const speedUpTheSnake = () => {
        if (applesEaten % 5 === 0) {
            setSnakeSpeed(prev => prev / SNAKE_SPEED_MULTIPLIER)
        }
    }

    const handleKeydown = (e: KeyboardEvent) => {
        setLastKey(e.key)
    }

    const isGameOver = () => {
        if (snakeHeadPosition.x >= BOARD_SIZE.x || snakeHeadPosition.x < 0 || snakeHeadPosition.y < 0 || snakeHeadPosition.y >= BOARD_SIZE.y) return true
        else if (snakeTailPositions.includes(snakeHeadPosition)) return true
        return false
    }

    document.addEventListener('keydown', handleKeydown) //useRef?

    return (
        <Grid applePosition={applePosition} snakeHead={snakeHeadPosition} snakeTail={snakeTailPositions} />
    )
}