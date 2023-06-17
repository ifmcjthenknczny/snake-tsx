import React, { useEffect, useRef, useState } from "react"
import { LOCAL_STORAGE_HIGH_SCORE_NAME } from "../constants/score"
import Game from "./Game"
import GameOver from "./GameOver"
import Menu from "./Menu"
import Settings from './Settings'
import '../styles/App.css'
import { GameState, MenuOption } from "../types/types"
import { Provider } from "react-redux"
import store from "../redux/store"

const App = () => {
    const [gameState, setGameState] = useState<GameState>('menu')
    const localScore = useRef(0)
    const highScore = useRef("0")

    useEffect(() => {
        const highScoreLocalStorage = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE_NAME)
        if (highScoreLocalStorage !== null) {
            highScore.current = highScoreLocalStorage
        }
    }, [])

    const handleNewGame = () => {
        setGameState('playing')
    }

    const handleSettings = () => {
        setGameState('settings')
    }

    const handleMenu = () => {
        setGameState('menu')
    }

    const handleGameOver = (score: number) => {
        setGameState('gameOver')
        localScore.current = score
        if (score > +highScore.current) {
            localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_NAME, `${score}`)
            highScore.current = `${score}`
        }
    }

    const MENU_OPTIONS: { label: MenuOption; onChosen: () => void }[] = [
        {
            label: "NEW GAME",
            onChosen: handleNewGame
        },
        {
            label: "SETTINGS",
            onChosen: handleSettings
        }
    ]

    return (
        <Provider store={store}>
            <div className="App">
                {gameState === 'gameOver' &&
                    <GameOver score={localScore.current} highScore={+highScore.current} onNewGame={handleNewGame} onMenu={handleMenu} />}
                {gameState === 'playing' && <Game onGameOver={handleGameOver} handleMenu={handleMenu} />}
                {gameState === 'menu' && <Menu options={MENU_OPTIONS} />}
                {gameState === 'settings' && <Settings onGoBack={handleMenu} />}
            </div>
        </Provider>
    )
}

export default App
