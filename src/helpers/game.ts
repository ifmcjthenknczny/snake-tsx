import { Coords } from '../constants/board'
import { OPPOSITE_DIRECTIONS } from '../constants/rules'
import { areDeepEqual } from '../utils/object'
import {
    coordsToInt,
    intToCoords,
    isAboutToGoOutsideGrid,
    isWithinGrid
} from './board'
import { Key } from '../constants/keys'

export const generateStartingSnakeTailCoords = (
    startingLength: number,
    startingHeadPosition: Coords,
    startingDirection: Key,
    boardSize: Coords
) => {
    const startingTailDirectionsOrder: Record<number, Key> = {
        1: 'ArrowRight',
        2: 'ArrowDown',
        3: 'ArrowLeft',
        4: 'ArrowUp'
    }
    const tailCoordsInt: number[] = []
    let directionIndex = Object.values(startingTailDirectionsOrder).findIndex(
        (key) => key === OPPOSITE_DIRECTIONS[startingDirection]
    ) // findNextHeadPosition needs to have opposite direction to be used
    while (tailCoordsInt.length < startingLength) {
        const direction: Key = startingTailDirectionsOrder[directionIndex]
        const proposedTailCoords: Coords = findNextHeadPosition(
            !tailCoordsInt.length
                ? startingHeadPosition
                : intToCoords(tailCoordsInt.at(-1), boardSize.x), // take the last calculated tail coord
            direction,
            true,
            boardSize
        )

        if (
            isWithinGrid(proposedTailCoords, boardSize) &&
            !tailCoordsInt.includes(
                coordsToInt(proposedTailCoords, boardSize.x)
            )
        ) {
            tailCoordsInt.push(coordsToInt(proposedTailCoords, boardSize.x))
        } else {
            // change direction clockwise if duplicate or out of grid
            directionIndex =
                (directionIndex + 1) %
                Object.keys(startingTailDirectionsOrder).length
        }
    }
    return tailCoordsInt
        .slice(1) // delete snake head
        .map((coords) => intToCoords(coords, boardSize.x))
}

export const findNextHeadPosition = (
    headCoords: Coords,
    currentKey: Key,
    isWalls: boolean,
    boardSize: Coords
) => {
    const skipToOtherSide =
        !isWalls && isAboutToGoOutsideGrid(currentKey, headCoords, boardSize)

    const nextPositionForKeys = {
        ArrowUp: { y: skipToOtherSide ? boardSize.y - 1 : headCoords.y - 1 },
        ArrowDown: { y: skipToOtherSide ? 0 : headCoords.y + 1 },
        ArrowLeft: { x: skipToOtherSide ? boardSize.x - 1 : headCoords.x - 1 },
        ArrowRight: { x: skipToOtherSide ? 0 : headCoords.x + 1 }
    }

    return { ...headCoords, ...nextPositionForKeys[currentKey] }
}

export const isEatingApple = (headCoords: Coords, appleCoords: Coords) =>
    areDeepEqual(headCoords, appleCoords)

export const isGameOver = (
    headCoords: Coords,
    tailCoords: Coords[],
    mineCoords: Coords[],
    isWalls: boolean,
    boardSize: Coords
) => {
    if (isWalls && !isWithinGrid(headCoords, boardSize)) {
        return 'wall'
    }
    for (const tail of tailCoords) {
        if (areDeepEqual(tail, headCoords)) {
            return 'tail'
        }
    }
    for (const mine of mineCoords) {
        if (areDeepEqual(mine, headCoords)) {
            return 'mine'
        }
    }
    return null
}

export const calculateHeadStartingPosition = (boardSize: Coords): Coords => ({
    x: Math.round(boardSize.x / 2),
    y: Math.round(boardSize.y / 2)
})
