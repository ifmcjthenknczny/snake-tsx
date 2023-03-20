import Logo from './Logo'
import '../styles/Menu.css'
import ClickableText from './ClickableText'

type Props = {
    onNewGame: () => void
    onSettings: () => void
}

const NEW_GAME_TEXT = "NEW GAME"
const SETTINGS_TEXT = "SETTINGS"

const Menu = ({onNewGame, onSettings}: Props) => {
    return (
        <div className="Menu">
            <Logo />
            <div className="Menu__options">
                <ClickableText onClick={onNewGame} text={NEW_GAME_TEXT} />
                <ClickableText onClick={onSettings} text={SETTINGS_TEXT} />

            </div>
            <div className="Menu__credits">2022-2023 Maciej Konieczny</div>
        </div>)
}

export default Menu