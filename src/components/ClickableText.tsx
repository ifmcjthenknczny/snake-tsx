import '../styles/ClickableText.css'

type Props = {
    text: string
    onClick: () => void
    className?: string
}

const ClickableText = ({text, onClick, className}: Props) => <button className={`ClickableText ${className}`} onClick={onClick}>{text}</button>

export default ClickableText