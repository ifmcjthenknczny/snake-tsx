import ClickableText from "./ClickableText"
import Logo from "./Logo"
import React from "react"
import useGoToMenu from "../hooks/useGoToMenu"
import { GO_BACK_TEXT } from "../constants/labels"
import styles from '../styles/Help.module.scss'

const contentLines = [
    "Use the arrow keys on your keyboard to move the snake around the game board",
    "Click esc anytime to go to menu",
    "The objective of the game is to eat as many apples as possible",
    "Each time the snake eats an apple, it will grow longer",
    "Points given for eating an apple depends on snake's length and speed as well as mines quantity on the board",
    "The game ends if the snake runs into the walls, mine or its own body",
]

const bait = "Try to beat your high score and see how long you can make the snake grow!"

const Help = () => {
    const onGoBack = useGoToMenu()

    return (
        <div className={styles.info}>
            <Logo />
            <div className={styles.content}>
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