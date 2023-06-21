import Logo from './Logo'
import styles from '../styles/Menu.module.scss'
import ClickableText from './ClickableText'
import React, { useState } from 'react'
import classNames from 'classnames'
import useKeyClick from '../hooks/useKeyClick'
import { MenuOption } from '../constants/labels'

type Props = {
    options: { label: MenuOption; onChosen: () => void }[]
}

const Menu = ({ options }: Props) => {
    const [focusedOption, setFocusedOption] = useState<number | null>(null)

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setFocusedOption(null)
        } else if (focusedOption === null) {
            setFocusedOption(0)
        } else if (e.key === 'ArrowUp') {
            setFocusedOption((prev => prev === 0 ? options.length - 1 : (prev - 1) % options.length))
        } else if (e.key === 'ArrowDown') {
            setFocusedOption((prev => (prev + 1) % options.length))
        } 
        // else if (e.key === 'Enter' && focusedOption !== null) {
        //     options[focusedOption].onChosen()
        // }
    }

    useKeyClick(handleKeydown)

    return (
        <div className={styles.menu}>
            <Logo />
            <div className={styles.options}>
                {options.map(({ label, onChosen }, i) => <ClickableText key={i} onClick={onChosen} text={label} className={classNames(focusedOption === i && styles.focused)} />)}
            </div>
            <div className={styles.credits}>2022-2023 Maciej Konieczny</div>
        </div>)
}

export default Menu