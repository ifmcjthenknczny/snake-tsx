import { SettingName } from "../types/types"
import { SETTINGS_PROPERTIES } from "../constants/settings"
import '../styles/SettingOption.css'
import { useState } from "react"
import classNames from "classnames"
import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { toggleSetting, updateSetting } from "../redux/slices"
import { useSelector } from "../redux/hooks"

type Props = {
    name: SettingName
    startingValue: number | boolean
}

const SettingOption = ({ name, startingValue }: Props) => {
    const { min, max, step, label, isBoolean, isDecimal } = SETTINGS_PROPERTIES[name]
    const [value, setValue] = useState<number | boolean>(startingValue)
    const [valueLabel, setValueLabel] = useState<string>(toValueLabel(startingValue))
    const dispatch = useDispatch()

    useEffect(() => {
        setValueLabel(toValueLabel(value, isDecimal))
    }, [value]) //eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isBoolean) {
            setValue(+e.target.value)
        }
        dispatch(updateSetting({ [name]: isBoolean ? !!+e.target.value : +e.target.value }))
    }

    const handleClick = () => {
        if (isBoolean) {
            setValue(prevValue => !prevValue)
            dispatch(toggleSetting(name))
        }
    }

    const handleDoubleClick = () => {
        setValue(SETTINGS_PROPERTIES[name].defaultValue)
        dispatch(updateSetting({ [name]: SETTINGS_PROPERTIES[name].defaultValue }))
    }

    return (
        <div className="SettingOption">
            <label className={classNames("SettingOption__label", SETTINGS_PROPERTIES[name].dependsOn && "SettingOption__dependent")} htmlFor={name}>{label}</label>
            <input className="SettingOption__input" type="range" value={+value} min={+min} max={+max} step={+step} onChange={handleChange} onClick={handleClick} onDoubleClick={handleDoubleClick} />
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