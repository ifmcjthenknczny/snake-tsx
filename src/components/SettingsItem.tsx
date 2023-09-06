import { SETTINGS_PROPERTIES } from "../constants/settings"
import styles from '../styles/SettingsItem.module.scss'
import classNames from "classnames"
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from "react-redux"
import { toggleBooleanSetting, updateSetting } from "../redux/slices"
import { useSelector } from "../redux/hooks"
import { SettingName } from "../constants/settings"

type Props = {
    name: SettingName
}

const SettingsItem = ({ name }: Props) => {
    const { settings } = useSelector()
    const { min, max, step, label, isBoolean, isDecimal } = SETTINGS_PROPERTIES[name]
    const initialValueLabel = useMemo(() => toValueLabel(settings[name].relative, name, isDecimal), [name]) //eslint-disable-line react-hooks/exhaustive-deps
    const [valueLabel, setValueLabel] = useState<string>(initialValueLabel)
    const dispatch = useDispatch()

    useEffect(() => {
        setValueLabel(toValueLabel(settings[name].relative, name, isDecimal))
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
            <div className={styles.operable}>
                <input className={styles.input} type="range" value={+settings[name].relative} min={+min} max={+max} step={+step} onChange={handleChange} onClick={handleClick} onDoubleClick={handleDoubleClick} />
                <div className={styles.value}>{valueLabel}</div>
            </div>
        </div>)
}

const toValueLabel = (value: number | boolean, settingName: SettingName, isDecimal?: true) => {
    if (settingName === 'SNAKE_SPEED_MULTIPLIER' && value === 1) {
        return 'OFF'
    }
    if (settingName === 'APPLES_TO_SPEED_UP_SNAKE' && value === 1) {
        return 'EVERY'
    }
    if (typeof value === 'boolean') {
        return !!value ? 'ON' : 'OFF'
    }
    if (isDecimal) {
        return `${value.toFixed(2)}`
    }
    return `${value}`
}

export default SettingsItem