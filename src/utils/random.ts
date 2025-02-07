export const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min

export const randomElement = <T>(array: T[]) =>
    array.length ? array[randInt(0, array.length)] : undefined
