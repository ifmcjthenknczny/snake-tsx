import { useEffect, useRef, useState } from 'react';
import { APPLES_TO_SPEED_UP, BOARD_SIZE, FORBIDDEN_DIRECTIONS, NEW_MINE_INTERVAL, SNAKE_SPEED_MULTIPLIER, STARTING_DIRECTION, STARTING_MOVE_REFRESH } from '../CONSTANTS';
import { isObjectsEqual, randomizeCoordsOnEmptySquares } from '../helpers';
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
    const [snakeTailPositions, setSnakeTailPositions] = useState<Coords[]>([])

    const [applePosition, setApplePosition] = useState(randomizeCoordsOnEmptySquares(BOARD_SIZE.x, BOARD_SIZE.y, [snakeHeadPosition]));
    const [minePositions, setMinePositions] = useState<Coords[]>([])

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(snakeHeadPosition)
    const keyFired = useRef(false)

    // const lastTime = useRef(Date.now())

    useEffect(() => {
        const moveInterval = setInterval(gameIteration, snakeSpeed)
        return () => {
            clearInterval(moveInterval)
        }
    })

    useEffect(() => {
        const mineInterval = setInterval(placeNewMine, NEW_MINE_INTERVAL)
        return () => {
            clearInterval(mineInterval)
        }
    }, [])

    const gameIteration = () => {
        snakeMove()
        if (checkGameOver()) props.onGameOver(applesEaten)
        if (isEatingApple()) eatApple()
    }

    const setLastKey = (key: string) => {
        // console.log(`curr: ${key}, forb: ${forbiddenDirection.current}`)
        if (key === forbiddenDirectionRef.current || key === keyRef.current) return
        keyRef.current = key
    }

    const setLastHeadPosition = () => {
        lastHeadPositionRef.current = snakeHeadPosition
    }

    const placeNewMine = () => {
        // console.log(Date.now() - lastTime.current)
        // lastTime.current = Date.now()
        console.log("FIRED!!!")
        const newMineCoords = randomizeCoordsOnEmptySquares(BOARD_SIZE.x, BOARD_SIZE.y, [applePosition, snakeHeadPosition, ...snakeTailPositions])
        setMinePositions(prev => [...prev, newMineCoords])
    }

    const snakeMove = () => {
        if (applesEaten > 0) forbiddenDirectionRef.current = FORBIDDEN_DIRECTIONS[keyRef.current]
        setLastHeadPosition()
        moveSnakeHead()
        moveSnakeTail()
    }

    const moveSnakeHead = () => {
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
    }

    const moveSnakeTail = () => {
        if (isEatingApple()) {
            setSnakeTailPositions(prev => {
                return [lastHeadPositionRef.current, ...prev]
            })
        } else {
            setSnakeTailPositions(prev => {
                let prevPosition = prev;
                if (applesEaten > 1) {
                    prevPosition = prevPosition.slice(0, -1)
                    prevPosition = [lastHeadPositionRef.current, ...prevPosition]
                }
                else if (applesEaten === 1) prevPosition = [lastHeadPositionRef.current]
                return prevPosition
            })
        }
    }

    const isEatingApple = () => {
        if (isObjectsEqual(snakeHeadPosition, applePosition)) return true
        return false
    }

    const eatApple = () => {
        // setInterval(() => setApplePosition(randomizeAppleCoords), APPLE_CHANGES_POSITION_TIME)
        placeNewApple()
        setApplesEaten(prev => {
            if ((prev + 1) % APPLES_TO_SPEED_UP === 0) speedUpTheSnake()
            return prev + 1
        })
    }

    const placeNewApple = () => {

        setApplePosition(randomizeCoordsOnEmptySquares(BOARD_SIZE.x, BOARD_SIZE.y, [snakeHeadPosition, ...snakeTailPositions, ...minePositions]))
        // clearTimeout(appleIntervalRef.current)
        // appleIntervalRef.current = setTimeout(placeApple, APPLE_CHANGE_POSITION_INTERVAL)
    }

    // const appleIntervalRef = useRef(setTimeout(placeNewApple, APPLE_CHANGE_POSITION_INTERVAL))

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
        if (snakeHeadPosition.x >= BOARD_SIZE.x || snakeHeadPosition.x < 0 || snakeHeadPosition.y < 0 || snakeHeadPosition.y >= BOARD_SIZE.y) {
            console.log("Crashed into a wall")
            return true
        }
        else {
            for (let tail of snakeTailPositions) {
                if (isObjectsEqual(tail, snakeHeadPosition)) {
                    console.log("Bit your own tail")
                    return true
                }
            }
            for (let mine of minePositions) {
                if (isObjectsEqual(mine, snakeHeadPosition)) {
                    console.log("Stepped on a mine")
                    return true
                }
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