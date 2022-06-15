import { useEffect, useState } from 'react';
import { BOARD_SIZE } from '../CONSTANTS';
import { randomizeCoords } from '../helpers';
import { Coords } from '../TYPES';
import Grid from './Grid';

export default function Game() {
    useEffect(() => {

        return () => {
        }
    }, [])


    const [snakeSpeed, setSnakeSpeed] = useState(1);
    const [applePosition, setApplePosition] = useState(randomizeCoords(BOARD_SIZE.x, BOARD_SIZE.y));
    const [lastKey, setLastKey] = useState('ArrowUp');
    const [applesEaten, setApplesEaten] = useState(0);
    const [snakeHeadPosition, setSnakeHeadPosition] = useState<Coords>({ x: Math.floor(BOARD_SIZE.x / 2), y: Math.floor(BOARD_SIZE.y / 2) })
    const [snakeTailPositions, setSnakeTailsPositions] = useState<Coords[]>([])

    const handleKeydown = (e: KeyboardEvent) => {
        setLastKey(e.key)
    }

    document.addEventListener('keydown', handleKeydown)

    return (
        <Grid applePosition={applePosition} snakeHead={snakeHeadPosition} snakeTail={snakeTailPositions} />
    )
}