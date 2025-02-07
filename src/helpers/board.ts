import { randInt, randomElement } from '../utils/random'
import { rangeExclude } from '../utils/range'
import { rangeWithModulo } from '../utils/range'
import {
    GAP_TO_CELL_RATIO,
    Coords,
    HEIGHT_DEPENDENT_BOARD_SIZE,
    WIDTH_DEPENDENT_BOARD_SIZE
} from '../constants/board'
import { Key } from '../constants/keys'
import { safeDivide } from '../utils/primitive'

export const generateRandomCoords = (boardSize: Coords) => ({
    x: randInt(0, boardSize.x),
    y: randInt(0, boardSize.y)
})

export const generateRandomAvailableCoords = (
    occupiedCoords: Coords[],
    boardSize: Coords
) => {
    const occupiedInts = occupiedCoords.map((coords) =>
        coordsToInt(coords, boardSize.x)
    )
    const availableInts = rangeExclude(
        0,
        boardSize.x * boardSize.y,
        occupiedInts
    )
    return intToCoords(randomElement(availableInts), boardSize.x)
}

export const coordsToInt = (coords: Coords, boardWidth: number) =>
    boardWidth * coords.y + coords.x

export const intToCoords = (int: number, boardWidth: number) => ({
    x: int % boardWidth,
    y: Math.floor(int / boardWidth)
})

export const isWithinGrid = (coords: Coords, boardSize: Coords) =>
    coords.x >= 0 &&
    coords.y >= 0 &&
    coords.x < boardSize.x &&
    coords.y < boardSize.y

export const isAboutToGoOutsideGrid = (
    key: Key,
    head: Coords,
    boardSize: Coords
) => {
    if (key === 'ArrowLeft' && head.x === 0) return true
    if (key === 'ArrowRight' && head.x === boardSize.x - 1) return true
    if (key === 'ArrowUp' && head.y === 0) return true
    if (key === 'ArrowDown' && head.y === boardSize.y - 1) return true
    return false
}

const findMinAndMaxCoord = (
    distance: number,
    coord: number,
    boardSize: number,
    isWalls: boolean
) => {
    let min = coord - distance
    let max = coord + distance
    if (isWalls) {
        min = Math.max(min, 0)
        max = Math.min(max, boardSize - 1)
    } else {
        min = min < 0 ? min + boardSize : min
        max = max > boardSize - 1 ? max % boardSize : max
    }
    return [min, max]
}

export const findCellsInRadius = (
    distance: number,
    referenceCell: Coords,
    isWalls: boolean,
    boardSize: Coords
) => {
    const [xMin, xMax] = findMinAndMaxCoord(
        distance,
        referenceCell.x,
        boardSize.x,
        isWalls
    )
    const [yMin, yMax] = findMinAndMaxCoord(
        distance,
        referenceCell.y,
        boardSize.y,
        isWalls
    )
    const xRange = rangeWithModulo(xMin, xMax, boardSize.x)
    const yRange = rangeWithModulo(yMin, yMax, boardSize.y)
    const cellsInSquare = []
    for (const x of xRange) {
        for (const y of yRange) {
            cellsInSquare.push({ x, y })
        }
    }
    return cellsInSquare
}

export const generateGridStyle = (boardSize: Coords, isWalls: boolean) => {
    const boardRelativeSize = calculateBoardRelativeSize(boardSize)
    const boardSizeCoeff =
        safeDivide(
            boardRelativeSize.value,
            Math.max(boardSize.x, boardSize.y),
            true
        ) /
        (1 + GAP_TO_CELL_RATIO)
    const gap = boardSizeCoeff * GAP_TO_CELL_RATIO

    return {
        width: `${gap * (boardSize.x - 1) + boardSizeCoeff * boardSize.x}${boardRelativeSize.unit}`,
        height: `${gap * (boardSize.y - 1) + boardSizeCoeff * boardSize.y}${boardRelativeSize.unit}`,
        gridTemplateColumns: `repeat(${boardSize.x}, ${boardSizeCoeff}${boardRelativeSize.unit})`,
        gridTemplateRows: `repeat(${boardSize.y}, ${boardSizeCoeff}${boardRelativeSize.unit})`,
        border: `${isWalls ? 10 : 2}px black solid`,
        gridColumnGap: `${gap}${boardRelativeSize.unit}`,
        gridRowGap: `${gap}${boardRelativeSize.unit}`
    }
}

export const calculateBoardRelativeSize = (boardSize: Coords) => {
    const screenRatio = window.innerWidth / window.innerHeight
    const boardRatio = boardSize.x / boardSize.y
    return boardRatio > screenRatio
        ? HEIGHT_DEPENDENT_BOARD_SIZE
        : WIDTH_DEPENDENT_BOARD_SIZE
}
