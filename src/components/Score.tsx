
type Props = {
    score: number
}

export default function Score(props: Props) {
    return (
        <div>Your score: {props.score}</div>
    )
}