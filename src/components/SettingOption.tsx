import { OptionsWithValue, OptionName } from "../utils/types"
import { OPTIONS_PROPERTIES } from "../utils/consts"
import '../styles/SettingOption.css'
import { useState } from "react"
import { toNumber } from "../utils/helpers"
import classNames from "classnames"
import React, { useEffect } from 'react'

type Props = {
    name: OptionName
    setSettings: React.Dispatch<React.SetStateAction<OptionsWithValue>>
    startingValue: number | boolean
}

const SettingOption = ({ name, setSettings, startingValue }: Props) => {
    const { min, max, step, label, isBoolean, isDecimal } = OPTIONS_PROPERTIES[name]
    const [value, setValue] = useState<number | boolean>(startingValue)
    const [valueLabel, setValueLabel] = useState<string>(toValueLabel(startingValue))

    useEffect(() => {
        setValueLabel(toValueLabel(value, isDecimal))
    }, [value]) //eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isBoolean) {
            setValue(+e.target.value)
        }
        setSettings(prevSettings => ({ ...prevSettings, [name]: isBoolean ? !!+e.target.value : +e.target.value }))
    }

    const handleClick = () => {
        if (isBoolean) {
            setValue(prevValue => !prevValue)
            setSettings(prevSettings => ({ ...prevSettings, [name]: !prevSettings[name] }))
        }
    }

    const handleDoubleClick = () => {
        setValue(OPTIONS_PROPERTIES[name].defaultValue)
        setSettings(prevSettings => ({ ...prevSettings, [name]: OPTIONS_PROPERTIES[name].defaultValue }))
    }

    return (
        <div className="SettingOption">
            <label className={classNames("SettingOption__label", OPTIONS_PROPERTIES[name].dependsOn && "SettingOption__dependent")} htmlFor={name}>{label}</label>
            <input className="SettingOption__input" type="range" value={toNumber(value)} min={toNumber(min)} max={toNumber(max)} step={toNumber(step)} onChange={handleChange} onClick={handleClick} onDoubleClick={handleDoubleClick} />
            <div className="SettingOption__value">{valueLabel}</div>
        </div>)
}

const toValueLabel = (value: number | boolean, isDecimal?: true) => {
    if (typeof value === 'boolean') {
        return !!value ? 'ON' : 'OFF'
    }
    if (isDecimal) {
        return `${value.toFixed(2)}`
    }
    return `${value}`
}

export default SettingOption