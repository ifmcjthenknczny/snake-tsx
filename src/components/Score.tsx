import '../styles/Score.css'

type Props = {
    score: number
}

const Score = ({ score }: Props) => (
    <div className="Score">Your score: {score}</div>
)

export default Score