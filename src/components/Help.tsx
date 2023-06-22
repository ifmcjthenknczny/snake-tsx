import ClickableText from "./ClickableText"
import Logo from "./Logo"
import React from "react"
import useGoToMenu from "../hooks/useGoToMenu"
import { GO_BACK_TEXT } from "../constants/labels"
import styles from '../styles/Help.module.scss'
import arrowKeys from '../assets/arrowkeys.png'
import esc from '../assets/esc.png'

const contentLines = [
    "The objective of the game is to earn points by eating as many apples as you can",
    "Amount of points earned is based on the snake's length, speed, and the number of mines on the board",
    "The game ends if the snake hits a wall, a mine, or its own body."
]

const bait = "Good luck and only the highest scores!"

const Help = () => {
    const onGoBack = useGoToMenu()

    return (
        <div className={styles.info}>
            <Logo />
            <div className={styles.content}>
                <div className={styles.controls}>
                    <ControlsHelp text="Use the arrow keys on your keyboard to move the snake around the game board" image={arrowKeys} />
                    <ControlsHelp text="Click escape anytime to go to menu" image={esc} />
                </div>
                <li className={styles.list}>
                    {contentLines.map((line, i) => <ul key={i} className={styles.element}>{line}</ul>)}
                </li>
                <div className={styles.bait}>{bait}</div>
            </div>
            <ClickableText text={GO_BACK_TEXT} onClick={onGoBack} />
        </div>
    )
}

export default Help


const ControlsHelp = ({ image, text }: { image: string; text: string }) => <div className={styles.control}>
    <div className={styles.imageWrapper}><img src={image} alt={''} /></div>
    {text}
</div>