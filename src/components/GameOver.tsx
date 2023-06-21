import styles from '../styles/GameOver.module.scss'
import ClickableText from './ClickableText'
import React from 'react'
import { useSelector } from '../redux/hooks'
import { useDispatch } from 'react-redux'
import { setGameState, setNewGame } from '../redux/slices'
import useHighScore from '../hooks/useHighScore'
import { GameOverReason } from '../constants/rules'

const GAME_OVER_LABELS: Record<GameOverReason, string> = { wall: "You crashed into a wall", tail: "You bit your own tail", mine: "You stepped on a mine" }

const LABELS = {
    again: "TRY AGAIN",
    newHighScore: "Congrats! It's your new high score!",
    menu: "MAIN MENU",
    title: "GAME OVER",
    highScore: "Your high score:",
    score: "Score:",
}

const GameOver = () => {
    const { lastGameOverReason: reason, score } = useSelector()
    const [highScore,] = useHighScore()
    const dispatch = useDispatch()

    return <div className={styles.gameOver}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{LABELS.title}</h1>
            <h6>{GAME_OVER_LABELS[reason]}!</h6>
            <h5>{LABELS.score} {score}</h5>
            {highScore > score ? <h6>{LABELS.highScore} {highScore}</h6> : <h6>{LABELS.newHighScore}</h6>}
            <div className={styles.options}>
                <ClickableText className={styles.again} text={LABELS.again} onClick={() => dispatch(setNewGame())} />
                <ClickableText className={styles.settings} text={LABELS.menu} onClick={() => dispatch(setGameState('settings'))} />
            </div>
        </div>
    </div>
}

export default GameOver