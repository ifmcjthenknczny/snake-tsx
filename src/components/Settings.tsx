import ClickableText from "./ClickableText"
import Logo from "./Logo"
import "../styles/Settings.css"
import { SettingsWithValue } from "../types/types"
import { SETTINGS, SETTINGS_PROPERTIES } from "../constants/settings"
import { MENU_KEY } from "../constants/keys"
import SettingsItem from './SettingsItem'
import React from "react"
import useKeyClick from "../hooks/useKeyClick"
import { useSelector } from "../redux/hooks"
import { useDispatch } from "react-redux"
import { setGameState } from "../redux/slices"

const GO_BACK_TEXT = "GO BACK"
const SETTINGS_TITLE = "SETTINGS"

const Settings = () => {
    const { settings } = useSelector()
    const dispatch = useDispatch()

    const onGoBack = () => dispatch(setGameState('menu'))

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
                {filterItemsToShow(settings).map(option => <SettingsItem key={option} name={option} />)}
            </div>
            <ClickableText text={GO_BACK_TEXT} onClick={onGoBack} />
        </div>
    )
}

const filterItemsToShow = (settings: SettingsWithValue) => SETTINGS.filter(item => !SETTINGS_PROPERTIES[item].dependsOn || SETTINGS_PROPERTIES[item].dependsOn.every(dependency => settings[dependency] === true))

export default Settings