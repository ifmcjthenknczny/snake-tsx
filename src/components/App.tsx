import React from "react"
import Game from "./Game"
import GameOver from "./GameOver"
import Menu from "./Menu"
import Settings from './Settings'
import '../styles/App.css'
import { MenuOption } from "../types/types"
import { useSelector } from "../redux/hooks"
import { useDispatch } from "react-redux"
import { setNewGame, setGameState } from "../redux/slices"

const App = () => {
    const { gameState } = useSelector()
    const dispatch = useDispatch()

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
                    <GameOver />}
                {gameState === 'playing' && <Game />}
                {gameState === 'menu' && <Menu options={MENU_OPTIONS} />}
                {gameState === 'settings' && <Settings />}
            </div>
    )
}

export default App
