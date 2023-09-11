import styles from './ClickableText.module.scss'
import classNames from 'classnames'
import React from 'react'

type Props = {
    text: string
    onClick: () => void
    className?: string
}

const ClickableText = ({ text, onClick, className }: Props) =>
    <button className={classNames(styles.clickableText, className)} onClick={onClick}>
        <span className={styles.textContent}>{text}</span>
    </button>

export default ClickableText