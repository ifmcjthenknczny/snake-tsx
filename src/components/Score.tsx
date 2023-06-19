import styles from '../styles/Score.module.scss'
import React from 'react'

type Props = {
    score: number
}

const Score = ({ score }: Props) => (
    <div className={styles.score}>Your score: {score}</div>
)

export default Score