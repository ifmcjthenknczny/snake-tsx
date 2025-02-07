// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const areDeepEqual = <T extends Record<string, any>>(obj1: T, obj2: T) =>
    JSON.stringify(obj1) === JSON.stringify(obj2)
