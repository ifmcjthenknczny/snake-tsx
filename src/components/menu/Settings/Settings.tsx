import ClickableText from '../../common/ClickableText/ClickableText'
import Logo from '../../common/Logo/Logo'
import styles from './Settings.module.scss'
import {
    SETTINGS_DEFAULTS,
    SettingName,
    SettingValuesSet
} from '../../../constants/settings'
import SettingsItem from '../SettingsItem/SettingsItem'
import React, { useState } from 'react'
import useGoToMenu from '../../../hooks/useGoToMenu'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { LOCAL_STORAGE_SETTINGS_NAME } from '../../../constants/localStorage'

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

    return (
        <div className={styles.settings}>
            <Logo />
            {SETTINGS_TITLE}
            <div className={styles.settingsList}>
                {Object.entries(settings).map(([name, values]) => (
                    <SettingsItem
                        key={name}
                        name={name as SettingName}
                        values={values}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>
            <ClickableText
                className={styles.goBackButton}
                text="GO BACK AND SAVE"
                onClick={handleGoBack}
            />
        </div>
    )
}

export default Settings
