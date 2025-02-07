import styles from './GameOver.module.scss'
import ClickableText from '../../common/ClickableText/ClickableText'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setGameState, setNewGame } from '../../../redux/slices'
import useHighScore from '../../../hooks/useHighScore'
import { GameOverReason } from '../../../constants/rules'
import useSelector from '../../../hooks/useSelector'

const GAME_OVER_LABELS: Record<GameOverReason, string> = {
    wall: 'crashed into a wall',
    tail: 'bit your own tail',
    mine: 'stepped on a mine'
}

const LABELS = {
    again: 'TRY AGAIN',
    newHighScore: "Congrats! It's your new high score!",
    menu: 'MAIN MENU',
    title: 'GAME OVER',
    highScore: 'Your high score:',
    score: 'Score:'
}

const GameOver = () => {
    const { lastGameOverReason: reason, score } = useSelector()
    const [highScore] = useHighScore()
    const dispatch = useDispatch()

    return (
        <div className={styles.gameOver}>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>{LABELS.title}</h1>
                <h6>{`You ${GAME_OVER_LABELS[reason]}!`}</h6>
                <h5>
                    {LABELS.score} {score}
                </h5>
                {highScore > score ? (
                    <h6>
                        {LABELS.highScore} {highScore}
                    </h6>
                ) : (
                    <h6>{LABELS.newHighScore}</h6>
                )}
                <div className={styles.options}>
                    <ClickableText
                        text={LABELS.again}
                        onClick={() => dispatch(setNewGame())}
                    />
                    <ClickableText
                        text={LABELS.menu}
                        onClick={() => dispatch(setGameState('menu'))}
                    />
                </div>
            </div>
        </div>
    )
}

export default GameOver
