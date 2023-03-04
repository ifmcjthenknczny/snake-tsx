import '../styles/GameOver.css'

type Props = {
    score: number;
    highScore: number;
    handleClick: () => void;
}

const GameOver = ({ score, highScore, handleClick }: Props) => {
    return (
        <div className="GameOver">
            <div className="GameOver__wrapper">
                <h1 className="GameOver__title">Game Over</h1>
                <h5>Score: {score}</h5>
                {highScore >= score ? <h6>Your high score: {highScore}</h6> : <h6>Congrats! It's your new high score!</h6>}
                <h3 className="GameOver__again" onClick={handleClick}>TRY AGAIN</h3>
            </div>
        </div>
    )
}

export default GameOver