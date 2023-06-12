import { useEffect, useRef, useState } from "react"
import { LOCAL_STORAGE_HIGH_SCORE_NAME, SETTINGS_DEFAULTS, OPTIONS } from "../utils/consts"
import Game from "./Game"
import GameOver from "./GameOver"
import Menu from "./Menu"
import Settings from './Settings'
import '../styles/App.css'
import { OptionsWithValue, GameState, GameOverReason } from "../utils/types"
import { calculateRealOptionValue } from "../utils/helpers"

const App = () => {
    const [gameState, setGameState] = useState<GameState>('menu')
    const [settings, setSettings] = useState<OptionsWithValue>(SETTINGS_DEFAULTS)
    const [gameOverReason, setGameOverReason] = useState<GameOverReason>()
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

    const handleGameOver = (score: number, reason: GameOverReason) => {
        setGameOverReason(reason)
        setGameState('gameOver')
        localScore.current = score
        if (score > +highScore.current) {
            localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_NAME, `${score}`)
            highScore.current = `${score}`
        }
    }
    // console.log(settings)
    // console.log(calculateRealSettingsValue(settings))

    return (
        <div className="App">
            {gameState === 'gameOver' &&
                <GameOver score={localScore.current} highScore={+highScore.current} onNewGame={handleNewGame} onMenu={handleMenu} reason={gameOverReason} />}
            {gameState === 'playing' && <Game onGameOver={handleGameOver} handleMenu={handleMenu} settings={OPTIONS.reduce((acc, option) => ({ ...acc, [option]: calculateRealOptionValue(option, settings[option]) }), {} as OptionsWithValue)} />}
            {gameState === 'menu' && <Menu onNewGame={handleNewGame} onSettings={handleSettings} />}
            {gameState === 'settings' && <Settings onGoBack={handleMenu} setSettings={setSettings} settings={settings} />}
        </div>
    )
}

export default App
