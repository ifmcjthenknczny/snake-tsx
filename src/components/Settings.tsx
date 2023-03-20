import ClickableText from "./ClickableText"
import Logo from "./Logo"
import "../styles/Settings.css"
import { OptionsWithValue } from "../utils/types"
import { OPTIONS, OPTIONS_PROPERTIES } from "../utils/consts"
import SettingOption from './SettingOption'

type Props = {
    onGoBack: () => void
    setSettings: React.Dispatch<React.SetStateAction<OptionsWithValue>>
    settings: OptionsWithValue
}

const GO_BACK_TEXT = "GO BACK"
const SETTINGS_TITLE = "SETTINGS"

const Settings = ({ onGoBack, setSettings, settings }: Props) => {
    return (
        <div className="Settings">
            <Logo />
            {SETTINGS_TITLE}
            <div className="Settings__options">
                {filterOptionsToShow(settings).map(option => <SettingOption key={option} name={option} setSettings={setSettings} startingValue={settings[option]} />)}
            </div>
            <ClickableText text={GO_BACK_TEXT} onClick={onGoBack} />
        </div>
    )
}

const filterOptionsToShow = (settings: OptionsWithValue) => OPTIONS.filter(option => !OPTIONS_PROPERTIES[option].dependsOn || OPTIONS_PROPERTIES[option].dependsOn.every(dependency => settings[dependency]))

export default Settings