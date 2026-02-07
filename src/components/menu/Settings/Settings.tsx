import ClickableText from '../../common/ClickableText/ClickableText'
import Logo from '../../common/Logo/Logo'
import styles from './Settings.module.scss'
import {
    SETTINGS_DEFAULTS,
    SettingName,
    SettingValuesSet
} from '../../../constants/settings'
import React, { useState } from 'react'
import useGoToMenu from '../../../hooks/useGoToMenu'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { LOCAL_STORAGE_SETTINGS_NAME } from '../../../constants/localStorage'
import SettingsList from '../SettingsList/SettingsList'

const SETTINGS_TITLE = 'SETTINGS'

const Settings = () => {
    const [storedSettings, setStoredSettings] = useLocalStorage(
        LOCAL_STORAGE_SETTINGS_NAME,
        SETTINGS_DEFAULTS
    )
    const [settings, setSettings] = useState(storedSettings)
    const onGoBack = useGoToMenu()

    const handleUpdate = (
        settingName: SettingName,
        newValues: SettingValuesSet
    ) => {
        setSettings((prev) => ({ ...prev, [settingName]: newValues }))
    }

    const handleGoBack = () => {
        setStoredSettings(settings)
        onGoBack()
    }

    const handleReset = () => {
        setSettings(SETTINGS_DEFAULTS)
    }

    return (
        <div className={styles.settings}>
            <Logo />
            {SETTINGS_TITLE}
            <SettingsList settings={settings} handleUpdate={handleUpdate} />
            <div className={styles.buttonContainer}>
                <ClickableText
                    text="RESET TO DEFAULT"
                    onClick={handleReset}
                />
                <ClickableText
                    text="GO BACK AND SAVE"
                    onClick={handleGoBack}
                />
            </div>
        </div>
    )
}

export default Settings
