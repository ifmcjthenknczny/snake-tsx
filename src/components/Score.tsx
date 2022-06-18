import '../styles/Score.css'

type ScoreProps = {
    score: number
}

export default function Score(props: ScoreProps) {
    return (
        <div className="Score">Your score: {props.score}</div>
    )
}