import { LOCAL_STORAGE_HIGH_SCORE_NAME } from '../constants/localStorage'
import useLocalStorage from './useLocalStorage'

const useHighScore = (): [number, (score: number) => void] => {
    const [highScore, setHighScore] = useLocalStorage(
        LOCAL_STORAGE_HIGH_SCORE_NAME,
        '0'
    )

    const trySetNewHighScore = (score: number) => {
        if (score > +highScore) {
            setHighScore(`${score}`)
        }
    }
    return [+highScore, trySetNewHighScore]
}

export default useHighScore
