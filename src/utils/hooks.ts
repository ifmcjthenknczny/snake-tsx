import { useEffect } from 'react'

export const useKeyClick = (onKeyDown?: (e: KeyboardEvent) => void, onKeyUp?: (e: KeyboardEvent) => void) => {
    useEffect(() => {
        if (onKeyUp) {
        document.addEventListener('keyup', onKeyUp)
        } if (onKeyDown) {
        document.addEventListener('keydown', onKeyDown)
        }
        return () => {
            if (onKeyUp) {
                document.removeEventListener('keyup', onKeyUp)
            }
            if (onKeyDown) {
                document.removeEventListener('keydown', onKeyDown)
            }
        }
    }, []) //eslint-disable-line react-hooks/exhaustive-deps
}