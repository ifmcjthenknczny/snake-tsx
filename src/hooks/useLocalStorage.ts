import { useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error retrieving '${key}' from localStorage: ${error}`);
      return initialValue;
    }
  });

  const updateValue = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(`Error setting '${key}' in localStorage: ${error}`);
    }
  };

  return [storedValue, updateValue];
};

export default useLocalStorage;
