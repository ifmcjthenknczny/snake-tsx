import '../styles/Score.css'

type Props = {
    score: number
}

export default function Score(props: Props) {
    return (
        <div className="Score">Your score: {props.score}</div>
    )
}