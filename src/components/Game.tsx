import { useEffect, useRef, useState } from 'react';
import { CONTROL_KEYS, OPPOSITE_DIRECTIONS, STARTING_DIRECTION, STARTING_HEAD_POSITION, STARTING_MINE, NEW_MINE_DISTANCE_FROM_HEAD, MENU_KEY } from '../utils/consts';
import { generateStartingSnakeTail, nextHeadPosition, randomAvailableCoords, isEatingApple, isGameOver, findCellsInRadius } from '../utils/helpers';
import '../styles/Game.css';
import { Coords, Key, OptionsWithValue } from '../utils/types';
import Grid from './Grid';
import Score from './Score';
import { GameOverReason } from '../utils/types';

type Props = {
    onGameOver: (score: number, reason: GameOverReason) => void;
    handleMenu: () => void;
    settings: OptionsWithValue
}

const Game = ({ onGameOver, handleMenu, settings }: Props) => {
    const [moveRefresh, setMovesRefresh] = useState(settings.STARTING_MOVE_REFRESH_MS as number);
    const [headCoords, setHeadCoords] = useState<Coords>(STARTING_HEAD_POSITION)
    const [tailCoords, setTailCoords] = useState<Coords[]>(generateStartingSnakeTail(settings.STARTING_LENGTH as number, STARTING_HEAD_POSITION, STARTING_DIRECTION))

    const [applesEaten, setApplesEaten] = useState(0);
    const [appleCoords, setAppleCoords] = useState(randomAvailableCoords([headCoords, ...tailCoords]));
    const [appleRefresh, setAppleRefresh] = useState(settings.APPLE_CHANGE_POSITION_INTERVAL_MS as number);

    const [mineCoords, setMineCoords] = useState<Coords[]>(STARTING_MINE ? [randomAvailableCoords([headCoords, ...tailCoords, appleCoords])] : [])

    const keyRef = useRef(STARTING_DIRECTION)
    const forbiddenDirectionRef = useRef<string | null>(null)
    const lastHeadPositionRef = useRef<Coords>(headCoords)
    const keyFired = useRef(false)

    const gameIteration = () => {
        snakeMoveIteration()
        const gameOver = isGameOver(headCoords, tailCoords, mineCoords, settings.WALLS as boolean)
        if (gameOver) {
            onGameOver(applesEaten, gameOver)
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
    }, [moveRefresh, headCoords])  //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const mineInterval = setInterval(placeNewMine, settings.NEW_MINE_INTERVAL_MS as number)
        return () => {
            clearInterval(mineInterval)
        }
    }, [])  //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const appleTimeout = setTimeout(placeNewApple, settings.APPLE_CHANGE_POSITION_INTERVAL_MS as number)
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
            if (!((prev + 1) % (settings.APPLES_TO_SPEED_UP_SNAKE as number))) speedUpAppleChangingPosition()
            return prev + 1
        })
        placeNewApple()
    }

    const placeNewApple = () => {
        setAppleCoords(randomAvailableCoords([headCoords, ...tailCoords, ...mineCoords, appleCoords]))
    }

    const speedUpSnake = () => {
        setMovesRefresh(prev => prev / (settings.SNAKE_SPEED_MULTIPLIER as number))
    }

    const speedUpAppleChangingPosition = () => {
        if (settings.APPLE_CHANGES_POSITION && settings.APPLE_CHANGE_POSITION_INTERVAL_WITH_SNAKE) {
            setAppleRefresh(prev => prev /  (settings.SNAKE_SPEED_MULTIPLIER as number))
        }
    }

    const handleKeypush = (e: KeyboardEvent) => {
        if ((CONTROL_KEYS as string[]).includes(e.key) && !keyFired.current) {
            keyFired.current = true
            setLastKey(e.key as Key)
        }
        else if (e.key === MENU_KEY) {
            handleMenu()
        }
    }

    const handleKeylift = () => {
        keyFired.current = false
    }

    document.addEventListener('keydown', handleKeypush)
    document.addEventListener('keyup', handleKeylift)

    return (
        <div className="Game">
            <Score score={applesEaten} />
            <Grid apple={appleCoords} snakeHead={headCoords} snakeTail={tailCoords} mines={mineCoords} isWalls={settings.WALLS as boolean} />
        </div>
    )
}

export default Game