import '../styles/GameOver.css'
import ClickableText from './ClickableText'
import { GameOverReason } from '../types/types'
import React from 'react'
import { useSelector } from '../redux/hooks'
import { useDispatch } from 'react-redux'
import { setGameState, setNewGame } from '../redux/slices'

type Props = {
    score: number;
    highScore: number;
}

const AGAIN_TEXT = "TRY AGAIN"
const NEW_HIGHSCORE_TEXT = "Congrats! It's your new high score!"
const MENU_TEXT = "MAIN MENU"
const TITLE = "GAME OVER"
const HIGH_SCORE = "Your high score:"
const SCORE = "Score:"
const GAME_OVER_LABELS: Record<GameOverReason, string> = { wall: "You crashed into a wall", tail: "You bit your own tail", mine: "You stepped on a mine" }

const GameOver = ({ score, highScore }: Props) => {
    const { lastGameOverReason: reason } = useSelector()
    const dispatch = useDispatch()

    return <div className="GameOver">
        <div className="GameOver__wrapper">
            <h1 className="GameOver__title">{TITLE}</h1>
            <h6>{GAME_OVER_LABELS[reason]}!</h6>
            <h5>{SCORE} {score}</h5>
            {highScore > score ? <h6>{HIGH_SCORE} {highScore}</h6> : <h6>{NEW_HIGHSCORE_TEXT}</h6>}
            <div className="GameOver__options">
                <ClickableText className="GameOver__again" text={AGAIN_TEXT} onClick={() => dispatch(setNewGame())} />
                <ClickableText className="GameOver__settings" text={MENU_TEXT} onClick={() => dispatch(setGameState('settings'))} />
            </div>
        </div>
    </div>
}

export default GameOver