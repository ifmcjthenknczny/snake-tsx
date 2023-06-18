import React, { useEffect, useRef } from "react"
import { LOCAL_STORAGE_HIGH_SCORE_NAME } from "../constants/score"
import Game from "./Game"
import GameOver from "./GameOver"
import Menu from "./Menu"
import Settings from './Settings'
import '../styles/App.css'
import { MenuOption } from "../types/types"
import { useSelector } from "../redux/hooks"
import { useDispatch } from "react-redux"
import { setNewGame, setGameState } from "../redux/slices"
import useLocalStorage from "../hooks/useLocalStorage"

const App = () => {
    const { gameState } = useSelector()
    const dispatch = useDispatch()
    const localScore = useRef(0)
    const highScore = useRef("0")

    useEffect(() => {
        const highScoreLocalStorage = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE_NAME)
        if (highScoreLocalStorage !== null) {
            highScore.current = highScoreLocalStorage
        }
    }, [])

    const handleGameOver = (score: number) => {
        localScore.current = score
        if (score > +highScore.current) {
            localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_NAME, `${score}`)
            highScore.current = `${score}`
        }
    }

    const MENU_OPTIONS: { label: MenuOption; onChosen: () => void }[] = [
        {
            label: "NEW GAME",
            onChosen: () => dispatch(setNewGame())
        },
        {
            label: "SETTINGS",
            onChosen: () => dispatch(setGameState('settings'))
        }
    ]

    return (
            <div className="App">
                {gameState === 'gameOver' &&
                    <GameOver score={localScore.current} highScore={+highScore.current} />}
                {gameState === 'playing' && <Game onGameOver={handleGameOver} />}
                {gameState === 'menu' && <Menu options={MENU_OPTIONS} />}
                {gameState === 'settings' && <Settings />}
            </div>
    )
}

export default App
