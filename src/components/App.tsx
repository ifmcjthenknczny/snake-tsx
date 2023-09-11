import React from "react"
import Game from "./game/Game/Game"
import GameOver from "./gameover/GameOver/GameOver"
import Menu from "./menu/Menu/Menu"
import Settings from './menu/Settings/Settings'
import styles from './App.module.scss'
import useSelector from "../hooks/useSelector"
import { useDispatch } from "react-redux"
import { setNewGame, setGameState } from "../redux/slices"
import Help from "./menu/Help/Help"
import { MenuOption } from "../constants/labels"

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
        },
        {
            label: "INSTRUCTIONS",
            onChosen: () => dispatch(setGameState('help'))
        }
    ]

    return (
        <div className={styles.app}>
            {gameState === 'gameOver' &&
                <GameOver />}
            {gameState === 'playing' && <Game />}
            {gameState === 'menu' && <Menu options={MENU_OPTIONS} />}
            {gameState === 'settings' && <Settings />}
            {gameState === 'help' && <Help />}
        </div>
    )
}

export default App
