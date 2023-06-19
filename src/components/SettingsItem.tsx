import { SettingName } from "../types/types"
import { SETTINGS_PROPERTIES } from "../constants/settings"
import styles from '../styles/SettingsItem.module.scss'
import { useState } from "react"
import classNames from "classnames"
import React, { useEffect } from 'react'
import { useDispatch } from "react-redux"
import { toggleBooleanSetting, updateSetting } from "../redux/slices"
import { useSelector } from "../redux/hooks"

type Props = {
    name: SettingName
}

const SettingsItem = ({ name }: Props) => {
    const { settings } = useSelector()
    const { min, max, step, label, isBoolean, isDecimal } = SETTINGS_PROPERTIES[name]
    const [valueLabel, setValueLabel] = useState<string>(toValueLabel(settings[name].relative))
    const dispatch = useDispatch()

    useEffect(() => {
        setValueLabel(toValueLabel(settings[name].relative, isDecimal))
    }, [settings[name].relative]) //eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isBoolean) {
            dispatch(updateSetting({ settingName: name, settingValue: +e.target.value }))
        }
    }

    const handleClick = () => {
        if (isBoolean) {
            dispatch(toggleBooleanSetting(name))
        }
    }

    const handleDoubleClick = () => {
        dispatch(updateSetting({ settingName: name, settingValue: SETTINGS_PROPERTIES[name].defaultValue }))
    }

    return (
        <div className={styles.item}>
            <label className={classNames(styles.label, SETTINGS_PROPERTIES[name].dependsOn && styles.dependent)} htmlFor={name}>{label}</label>
            <input className={styles.input} type="range" value={+settings[name].relative} min={+min} max={+max} step={+step} onChange={handleChange} onClick={handleClick} onDoubleClick={handleDoubleClick} />
            <div className={styles.value}>{valueLabel}</div>
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