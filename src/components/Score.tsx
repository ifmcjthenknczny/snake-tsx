import '../styles/Score.css'
import React from 'react'

type Props = {
    score: number
}

const Score = ({ score }: Props) => (
    <div className="Score">Your score: {score}</div>
)

export default Score