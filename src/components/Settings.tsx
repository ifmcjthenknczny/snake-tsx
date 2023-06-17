import ClickableText from "./ClickableText"
import Logo from "./Logo"
import "../styles/Settings.css"
import { SettingsWithValue } from "../types/types"
import { SETTINGS, SETTINGS_PROPERTIES } from "../constants/settings"
import { MENU_KEY } from "../constants/keys"
import SettingOption from './SettingOption'
import React from "react"
import useKeyClick from "../hooks/useKeyClick"
import { useSelector } from "../redux/hooks"

type Props = {
    onGoBack: () => void
}

const GO_BACK_TEXT = "GO BACK"
const SETTINGS_TITLE = "SETTINGS"

const Settings = ({ onGoBack }: Props) => {
    const { settings } = useSelector()
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === MENU_KEY) {
            onGoBack()
        }
    }

    useKeyClick(handleKeydown)

    return (
        <div className="Settings">
            <Logo />
            {SETTINGS_TITLE}
            <div className="Settings__options">
                {filterOptionsToShow(settings).map(option => <SettingOption key={option} name={option} startingValue={settings[option]} />)}
            </div>
            <ClickableText text={GO_BACK_TEXT} onClick={onGoBack} />
        </div>
    )
}

const filterOptionsToShow = (settings: SettingsWithValue) => SETTINGS.filter(option => !SETTINGS_PROPERTIES[option].dependsOn || SETTINGS_PROPERTIES[option].dependsOn.every(dependency => settings[dependency] === true))

export default Settings