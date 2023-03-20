import { OptionsWithValue, Option } from "../utils/types"
import { OPTIONS_PROPERTIES } from "../utils/consts"
import '../styles/SettingOption.css'
import { useState } from "react"
import { toNumber } from "../utils/helpers"

type Props = {
    name: Option
    setSettings: React.Dispatch<React.SetStateAction<OptionsWithValue>>
    startingValue: number | boolean
}

const SettingOption = ({ name, setSettings, startingValue }: Props) => {
    const { min, max, step, label, isBoolean, isDecimal } = OPTIONS_PROPERTIES[name]
    const [value, setValue] = useState<number | boolean>(startingValue)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isBoolean) {
            setValue(!+e.target.value)
        } else {
            setValue(+e.target.value)
        }
        setSettings(prevSettings => ({ ...prevSettings, [name]: isBoolean ? !!+e.target.value : +e.target.value }))
    }

    const handleClick = () => {
        if (isBoolean) {
            setValue(prevValue => +!prevValue)
            setSettings(prevSettings => ({ ...prevSettings, [name]: !prevSettings[name] }))
        }
    }

    return (
        <div className="SettingOption">
            <div className="SettingOption__labelWithInput">
                <label className="SettingOption__label" htmlFor={name}>{label}</label>
                <input className="SettingOption__input" type="range" value={toNumber(value)} min={toNumber(min)} max={toNumber(max)} step={toNumber(step)} onChange={handleChange} onClick={handleClick} />
            </div>
            <div className="SettingOption__value">{toValueLabel(value, isDecimal)}</div>
        </div>)
}

const toValueLabel = (value: number | boolean, isDecimal?: boolean) => {
    if (typeof value === 'boolean') {
        return VALUE_LABELS[`${value}`]
    }
    if (isDecimal) {
        return `${value.toFixed(2)}`
    }
    return `${value}`
}

const VALUE_LABELS = {
    true: 'ON',
    false: 'OFF'
}

export default SettingOption