import styles from './Logo.module.scss'
import React from 'react'
import { GAME_TITLE } from '../../../constants/labels'

const Logo = () => <div className={styles.logo}>{GAME_TITLE}</div>

export default Logo
