const randInt = (min: number, max: number) => {
    // max is exclusive
    return Math.floor(Math.random()*(max-min))+min;
}

export const randomizeCoords = (xMax: number, yMax: number) => {
    return {x: randInt(0, xMax), y: randInt(0, yMax)}
}