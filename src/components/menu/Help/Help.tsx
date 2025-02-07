import ClickableText from '../../common/ClickableText/ClickableText'
import Logo from '../../common/Logo/Logo'
import React from 'react'
import useGoToMenu from '../../../hooks/useGoToMenu'
import styles from './Help.module.scss'
import arrowKeys from '../../../assets/arrowkeys.png'
import esc from '../../../assets/esc.png'
import mobileTouch from '../../../assets/mobile-touch-small.png'
import { MOBILE_GO_BACK_TEXT } from '../../game/BoardWrapper/BoardWrapper'
import classNames from 'classnames'

const CONTENT_LINES = [
    'The objective of the game is to earn points by eating as many apples as you can. The more apples you eat, the faster you are.',
    'Amount of points earned by eating an apple is based on the your length, speed, and the number of mines on the board. You also earn points for time elapsed in the game.',
    'Avoid walls, black mines and your own body.'
]

const BAIT = 'Good luck and only the highest of scores for you!'

const Help = () => {
    const onGoBack = useGoToMenu()

    return (
        <div className={styles.info}>
            <Logo />
            <div className={styles.content}>
                <div
                    className={classNames(
                        styles.controls,
                        styles.desktopControls
                    )}
                >
                    <ControlsHelp
                        text="Use the arrow keys on your keyboard to move the snake around the game board."
                        image={arrowKeys}
                    />
                    <ControlsHelp
                        text="Click escape anytime to go to menu."
                        image={esc}
                    />
                </div>
                <div
                    className={classNames(
                        styles.controls,
                        styles.mobileControls
                    )}
                >
                    <ControlsHelp
                        text="Control snake's movements by clicking on the edge of the board where you want your snake to move to."
                        image={mobileTouch}
                    />
                    <ControlsHelp
                        text={`Click bottom text "${MOBILE_GO_BACK_TEXT}" to go back to menu.`}
                    />
                </div>
                <li className={styles.list}>
                    {CONTENT_LINES.map((line, i) => (
                        <ul key={i} className={styles.element}>
                            {line}
                        </ul>
                    ))}
                </li>
                <div className={styles.bait}>{BAIT}</div>
            </div>
            <ClickableText text="GO BACK" onClick={onGoBack} />
        </div>
    )
}

export default Help

const ControlsHelp = ({ image, text }: { image?: string; text: string }) => (
    <div className={styles.control}>
        {image && (
            <div className={styles.imageWrapper}>
                <img src={image} alt={''} />
            </div>
        )}
        {text}
    </div>
)
