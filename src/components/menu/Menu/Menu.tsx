import Logo from '../../common/Logo/Logo'
import styles from './Menu.module.scss'
import ClickableText from '../../common/ClickableText/ClickableText'
import React from 'react'
import { MenuOption } from '../../../constants/labels'

type Props = {
    options: { label: MenuOption; onChosen: () => void }[]
}

const Menu = ({ options }: Props) => (
    <div className={styles.menu}>
        <Logo />
        <div className={styles.options}>
            {options.map(({ label, onChosen }, i) => (
                <ClickableText key={i} onClick={onChosen} text={label} />
            ))}
        </div>
        <div className={styles.credits}>
            2022-{new Date().getFullYear()} Maciej Konieczny
        </div>
    </div>
)

export default Menu
