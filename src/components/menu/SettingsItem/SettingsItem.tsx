import {
    SETTINGS_PROPERTIES,
    SettingValuesSet,
    SettingName
} from '../../../constants/settings'
import styles from './SettingsItem.module.scss'
import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import {
    calculateRealSettingValue,
    toValueLabel
} from '../../../helpers/settings'

type Props = {
    name: SettingName
    values: SettingValuesSet
    onUpdate: (settingName: SettingName, newValues: SettingValuesSet) => void
    disabled: boolean
}

const SettingsItem = ({ name, values, onUpdate, disabled }: Props) => {
    const { min, max, step, label, isBoolean, isDecimal } =
        SETTINGS_PROPERTIES[name]
    const initialValueLabel = useMemo(
        () => toValueLabel(values.relative, name, isDecimal),
        [name]
    )
    const [valueLabel, setValueLabel] = useState<string>(initialValueLabel)

    useEffect(() => {
        setValueLabel(toValueLabel(values.relative, name, isDecimal))
    }, [values.relative])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isBoolean) {
            onUpdate(name, {
                relative: +e.target.value,
                real: calculateRealSettingValue(name, +e.target.value)
            })
        }
    }

    const handleClick = () => {
        if (isBoolean) {
            onUpdate(name, {
                relative: !values.relative,
                real: !values.real
            })
        }
    }

    const handleDoubleClick = () => {
        onUpdate(name, {
            relative: SETTINGS_PROPERTIES[name].defaultValue,
            real: calculateRealSettingValue(
                name,
                SETTINGS_PROPERTIES[name].defaultValue
            )
        })
    }

    return (
        <div className={classNames(styles.item, disabled && styles.disabled)}>
            <label
                className={styles.label}
                htmlFor={name}
            >
                {label}
            </label>
            <div className={styles.operable}>
                <input
                    className={styles.input}
                    type="range"
                    value={+values.relative}
                    min={+min}
                    max={+max}
                    step={+step}
                    onChange={disabled ? undefined : handleChange}
                    onClick={disabled ? undefined : handleClick}
                    onDoubleClick={disabled ? undefined : handleDoubleClick}
                    disabled={disabled}
                />
                <div className={styles.value}>{valueLabel}</div>
            </div>
        </div>
    )
}

export default SettingsItem
