import { useState } from 'react'

const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    const updateValue = (value: T) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            setStoredValue(value)
        } catch {
            // do nothing
        }
    }

    return [storedValue, updateValue]
}

export default useLocalStorage
