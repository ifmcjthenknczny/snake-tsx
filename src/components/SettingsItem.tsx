import { SettingName } from "../types/types"
import { SETTINGS_PROPERTIES } from "../constants/settings"
import '../styles/SettingsItem.css'
import { useState } from "react"
import classNames from "classnames"
import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { toggleSetting, updateSetting } from "../redux/slices"
import { useSelector } from "../redux/hooks"

type Props = {
    name: SettingName
}

const SettingsItem = ({ name }: Props) => {
    const { settings } = useSelector()
    const { min, max, step, label, isBoolean, isDecimal } = SETTINGS_PROPERTIES[name]
    const [valueLabel, setValueLabel] = useState<string>(toValueLabel(settings[name]))
    const dispatch = useDispatch()

    useEffect(() => {
        setValueLabel(toValueLabel(settings[name], isDecimal))
    }, [settings[name]]) //eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSetting({ [name]: isBoolean ? !!+e.target.value : +e.target.value }))
    }

    const handleClick = () => {
        if (isBoolean) {
            dispatch(toggleSetting(name))
        }
    }

    const handleDoubleClick = () => {
        dispatch(updateSetting({ [name]: SETTINGS_PROPERTIES[name].defaultValue }))
    }

    return (
        <div className="SettingsItem">
            <label className={classNames("SettingsItem__label", SETTINGS_PROPERTIES[name].dependsOn && "SettingsItem__dependent")} htmlFor={name}>{label}</label>
            <input className="SettingsItem__input" type="range" value={+settings[name]} min={+min} max={+max} step={+step} onChange={handleChange} onClick={handleClick} onDoubleClick={handleDoubleClick} />
            <div className="SettingsItem__value">{valueLabel}</div>
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

export default SettingsItem