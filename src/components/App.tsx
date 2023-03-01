import { useEffect, useRef, useState } from "react"
import { LOCAL_STORAGE_HIGH_SCORE_NAME } from "../conts"
import Game from "./Game"
import GameOver from "./GameOver"
import '../styles/App.css'

const App = () => {
    const [isGameOver, setGameOver] = useState(false)
    const localScore = useRef(0)
    const highScore = useRef("0")

    useEffect(() => {
        const highScoreLocalStorage = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE_NAME)
        if (highScoreLocalStorage !== null) {
            highScore.current = highScoreLocalStorage
        }
    }, [])

    const handlePlayAgain = () => {
        setGameOver(false)
    }

    const handleGameOver = (score: number) => {
        setGameOver(true)
        localScore.current = score
        if (score > +highScore.current) {
            localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_NAME, `${score}`)
            highScore.current = `${score}`
        }
    }

    return (
        <div className="App">
            {isGameOver ?
                <GameOver score={localScore.current} highScore={+highScore.current} handleClick={handlePlayAgain} /> :
                <Game onGameOver={handleGameOver} />}
        </div>
    )
}

export default App