import { Coords } from './TYPES';

const randInt = (min: number, max: number) => {
    // max is exclusive
    return Math.floor(Math.random()*(max-min))+min;
}

export const randomizeCoords = (xMax: number, yMax: number) => {
    return {x: randInt(0, xMax), y: randInt(0, yMax)}
}

export const checkIfCoordsEmpty = (coords: Coords, occupiedCoords: Coords[]) => {
    const coordsJSON = JSON.stringify(coords)
    for (let occupiedCoord of occupiedCoords) {
        if (JSON.stringify(occupiedCoord) === coordsJSON) return false
    }
    return true
}

export const randomizeCoordsOnEmptySquares = (xMax: number, yMax: number, occupiedCoords?: Coords[]) => {
    while (true) {
        const randomCoords = randomizeCoords(xMax, yMax)
        if (occupiedCoords === null || checkIfCoordsEmpty(randomCoords, occupiedCoords) === true) return randomCoords
    }
}

export function isObjectsEqual(obj1: {}, obj2: {}) {
	return JSON.stringify(obj1) === JSON.stringify(obj2)
}