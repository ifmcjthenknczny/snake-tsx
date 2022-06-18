import '../styles/GameOver.css'

type GameOverProps = {
    score: number;
    highScore: number;
    handleClick: () => void;
}

export default function GameOver(props: GameOverProps) {
    const {score, highScore, handleClick} = props;
    return (
        <div className="GameOver">
            <h1>Game Over</h1>
            <h5>Your score: {score}</h5>
            {highScore >= score ? <h6>High score: {highScore}</h6> : <h6>Congrats! It's your new high score!</h6>}
            <h3 className="GameOver__again" onClick={handleClick}>TRY AGAIN</h3>
        </div>
    )
}