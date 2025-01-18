export const areDeepEqual = (obj1: Record<string, string>, obj2: Record<string, string>) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);